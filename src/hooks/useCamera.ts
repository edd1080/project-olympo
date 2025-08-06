import { useState, useRef, useCallback } from 'react';

interface CameraState {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
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
        await new Promise((resolve) => {
          const handleLoadedData = () => {
            videoRef.current?.removeEventListener('loadeddata', handleLoadedData);
            resolve(true);
          };
          videoRef.current?.addEventListener('loadeddata', handleLoadedData);
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
    if (!videoRef.current || videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      console.error('Video not ready for capture');
      return null;
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return null;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
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