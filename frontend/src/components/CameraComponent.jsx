import React, { useRef, useEffect, useState } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // По умолчанию задняя камера

  // Функция для получения видеопотока с указанным facingMode
  const getStream = () => {
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
  };

  // Запускаем getStream при монтировании компонента и при изменении facingMode
  useEffect(() => {
    getStream();

    // Остановка треков при размонтировании компонента
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

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

          fetch('http://127.0.0.1:8000/api/upload-photo/', {
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
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