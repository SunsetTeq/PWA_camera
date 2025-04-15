import { useEffect } from 'react';

const useCamera = (facingMode, onError, ref) => {
  
    useEffect(() => {
      const localVideo = ref.current;
  
      const getStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facingMode } },
          });
          if (localVideo) {
            localVideo.srcObject = stream;
          }
        } catch (err) {
          console.error('Ошибка доступа к камере:', err);
          onError && onError('Не удалось получить доступ к камере');
        }
      };
  
      getStream();
  
      return () => {
        if (localVideo && localVideo.srcObject) {
          const tracks = localVideo.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }, [facingMode, onError, ref]);
  
    return ref;
  };

  export default useCamera