import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  isVideoReady: boolean;
  currentFacing: 'user' | 'environment';
  availableCameras: number;
}

export const useCamera = (facingMode: 'user' | 'environment' = 'environment') => {
  const [state, setState] = useState<CameraState>({
    isOpen: false,
    isLoading: false,
    error: null,
    hasPermission: false,
    isVideoReady: false,
    currentFacing: facingMode,
    availableCameras: 0
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermission = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Check available cameras first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // Try with exact facingMode first
      if (facingMode === 'environment') {
        (constraints.video as any).facingMode = { exact: 'environment' };
      } else {
        (constraints.video as any).facingMode = { exact: 'user' };
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.log('Exact facingMode failed, trying ideal:', error);
        // Fallback to ideal if exact fails
        (constraints.video as any).facingMode = { ideal: facingMode };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        // Esperar a que el video esté completamente cargado
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Video load timeout'));
          }, 10000);
          
          const handleLoadedMetadata = () => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            videoRef.current?.removeEventListener('playing', handlePlaying);
            
            setState(prev => ({ ...prev, isVideoReady: true }));
            console.log('Video metadata loaded, setting ready state');
            
            // Asegurar que el video esté reproduciéndose
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log('Video is playing');
                  resolve(true);
                })
                .catch((err) => {
                  console.error('Error playing video:', err);
                  resolve(true); // Continuar aunque el play falle
                });
            } else {
              resolve(true);
            }
          };

          const handlePlaying = () => {
            setState(prev => ({ ...prev, isVideoReady: true }));
            console.log('Video is playing, setting ready state');
          };
          
          const handleError = (error: Event) => {
            clearTimeout(timeout);
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoRef.current?.removeEventListener('error', handleError);
            videoRef.current?.removeEventListener('playing', handlePlaying);
            reject(error);
          };
          
          videoRef.current?.addEventListener('loadedmetadata', handleLoadedMetadata);
          videoRef.current?.addEventListener('playing', handlePlaying);
          videoRef.current?.addEventListener('error', handleError);
        });
      }
      
      setState(prev => ({ 
        ...prev, 
        isOpen: true, 
        isLoading: false, 
        hasPermission: true,
        currentFacing: facingMode,
        availableCameras: videoDevices.length
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

  const switchCamera = useCallback(async (newFacingMode: 'user' | 'environment') => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, isVideoReady: false }));

    try {
      let constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // Try with exact facingMode first
      if (newFacingMode === 'environment') {
        (constraints.video as any).facingMode = { exact: 'environment' };
      } else {
        (constraints.video as any).facingMode = { exact: 'user' };
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.log('Exact facingMode failed, trying ideal:', error);
        // Fallback to ideal if exact fails
        (constraints.video as any).facingMode = { ideal: newFacingMode };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        
        await new Promise((resolve) => {
          const handleLoadedMetadata = () => {
            videoRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
            setState(prev => ({ 
              ...prev, 
              isVideoReady: true, 
              isLoading: false,
              currentFacing: newFacingMode 
            }));
            resolve(true);
          };
          videoRef.current?.addEventListener('loadedmetadata', handleLoadedMetadata);
        });
      }
    } catch (error) {
      console.error('Camera switch error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
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
      hasPermission: false,
      isVideoReady: false,
      currentFacing: 'environment',
      availableCameras: 0
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