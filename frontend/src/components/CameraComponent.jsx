import React, { useRef, useEffect, useState, useCallback } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // По умолчанию задняя камера

  const getStream = useCallback(() => {
    // Если уже есть поток, останавливаем его
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode } }
    })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Ошибка доступа к камере:", err);
        setMessage('Не удалось получить доступ к камере');
      });
  }, [facingMode]);

  useEffect(() => {
    getStream();
  
    const videoNode = videoRef.current;
    return () => {
      if (videoNode && videoNode.srcObject) {
        const tracks = videoNode.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [getStream]);

  // Функция для переключения между камерами
  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Функция для захвата кадра и отправки фото на сервер
  const captureAndSendPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('photo', blob, 'photo.png');

          fetch('https://192.168.1.181:8000/api/upload-photo/', {
            method: 'POST',
            body: formData
          })
            .then(response => {
              console.log('Статус ответа:', response.status);
              if (!response.ok) {
                throw new Error('Ошибка сети');
              }
              return response.json();
            })
            .then(data => {
              console.log("Ответ сервера:", data);
              setMessage('Фото отправлено!');
            })
            .catch(error => {
              console.error("Ошибка при отправке фото:", error);
              setMessage('Ошибка при отправке фото');
            });
        }
      }, 'image/png');
    }
  };

  return (
    <div>
      <h2>Камера</h2>
      <video
        ref={videoRef}
        width="320"
        height="240"
        autoPlay
        muted
        playsInline
      />
      <br />
      <button onClick={toggleCamera}>
        Переключить камеру (текущая: {facingMode === 'environment' ? 'задняя' : 'фронтальная'})
      </button>
      <br />
      <button onClick={captureAndSendPhoto}>Сделать снимок и отправить</button>
      {/* Canvas используется для захвата кадра, его можно скрыть */}
      <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default CameraComponent;