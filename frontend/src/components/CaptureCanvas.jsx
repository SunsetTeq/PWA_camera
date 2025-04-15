import React, { useRef } from 'react';

const CaptureCanvas = ({ videoRef, facingMode, onPhotoCaptured }) => {
  const canvasRef = useRef(null);

  const captureAndSendPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      if (facingMode === 'user') {
        context.save();
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);
        context.restore();
      } else {
        context.drawImage(video, 0, 0, width, height);
      }

      canvas.toBlob((blob) => {
        console.log('Blob создан:', blob);
        if (blob) {
          const formData = new FormData();
          formData.append('photo', blob, 'photo.png');

          fetch('https://192.168.1.181:8000/api/upload-photo/', {
            method: 'POST',
            body: formData
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Ошибка сети');
              }
              return response.json();
            })
            .then(data => {
              onPhotoCaptured && onPhotoCaptured(data.message);
            })
            .catch(error => {
              console.error("Ошибка при отправке фото:", error);
              onPhotoCaptured && onPhotoCaptured('Ошибка при отправке фото');
            });
        }
      }, 'image/png');
    }
  };

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={captureAndSendPhoto}>Сделать снимок и отправить</button>
    </>
  );
};

export default CaptureCanvas;