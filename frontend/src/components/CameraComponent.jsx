import React, { useRef, useEffect, useState, useCallback } from 'react';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');
  const [facingMode, setFacingMode] = useState('user'); // По умолчанию задняя камера

  // Функция для получения видеопотока с указанным facingMode
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

  // Функция для захвата кадра с исходным разрешением и инвертированием, затем отправки фото на сервер
  const captureAndSendPhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Устанавливаем canvas согласно фактическим размерам видеопотока
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      
      const context = canvas.getContext('2d');
      
      // инвертируем изображение с фронтальной камеры
      if (facingMode === 'user') {
        context.save();
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);
        context.restore();
      } else {
        context.drawImage(video, 0, 0, width, height);
      }

      // Преобразуем canvas в Blob
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
      {/* <h2>Камера</h2> */}
      <video
        ref={videoRef}
        style={{
          width: '95%',
          height: '95%',
          objectFit: 'cover', // Заполняет контейнер без искажений
          transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
        }}
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
      {/* Canvas используется для захвата кадра, он может оставаться скрытым */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default CameraComponent;