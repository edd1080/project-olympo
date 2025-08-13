import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  capturePhoto: () => Promise<string>;
  isCapturing: boolean;
}

export const useCamera = (facingMode: 'user' | 'environment' = 'environment') => {
  const [state, setState] = useState<CameraState>({
    isOpen: false,
    isLoading: false,
    error: null,
    hasPermission: false
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermission = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Esperar a que el video esté completamente cargado
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video load timeout'));
          }, 10000);
          
          const handleLoadedMetadata = () => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            
            // Asegurar que el video esté reproduciéndose
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => resolve(true))
                .catch((err) => {
                  console.error('Error playing video:', err);
                  resolve(true); // Continuar aunque el play falle
                });
            } else {
              resolve(true);
            }
          };
          
          const handleError = (error: Event) => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            reject(error);
          };
          
          videoRef.current?.addEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current?.addEventListener('error', handleError);
        });
      }
      
      setState(prev => ({ 
        ...prev, 
        isOpen: true, 
        isLoading: false, 
        hasPermission: true 
      }));
      
      return true;
    } catch (error) {
      console.error('Camera access error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'No se pudo acceder a la cámara. Verifica los permisos.' 
      }));
      return false;
    }
  }, [facingMode]);

  const switchCamera = useCallback(async (facingMode: 'user' | 'environment') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'No se pudo cambiar la cámara.' 
      }));
    }
  }, []);

  const capture = useCallback((): string | null => {
    if (!videoRef.current) {
      console.error('Video element not available');
      return null;
    }

    // Verificar que el video esté listo
    if (videoRef.current.readyState < 2) {
      console.error('Video not ready for capture, readyState:', videoRef.current.readyState);
      return null;
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.error('Video dimensions not available:', {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        console.error('Could not get canvas context');
        return null;
      }

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const dataURL = canvas.toDataURL('image/jpeg', 0.8);
      console.log('Image captured successfully');
      return dataURL;
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setState({
      isOpen: false,
      isLoading: false,
      error: null,
      hasPermission: false
    });
  }, []);

  return {
    ...state,
    videoRef,
    requestPermission,
    switchCamera,
    capture,
    closeCamera
  };
};