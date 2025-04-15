import React from 'react';

const CameraControls = ({ facingMode, toggleCamera, message }) => {
  return (
    <div>
      <button onClick={toggleCamera}>
        Переключить камеру (текущая: {facingMode === 'environment' ? 'задняя' : 'фронтальная'})
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CameraControls;