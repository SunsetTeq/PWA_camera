import React, { useState, useRef } from 'react';
import VideoStream from './VideoStream';
import CaptureCanvas from './CaptureCanvas';
import CameraControls from './CameraControls';

const CameraComponent = () => {
  const [message, setMessage] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const videoRef = useRef(null);

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div>
      <VideoStream facingMode={facingMode} onStreamError={setMessage} ref={videoRef} />
      <CameraControls facingMode={facingMode} toggleCamera={toggleCamera} message={message} />
      <CaptureCanvas videoRef={videoRef} facingMode={facingMode} onPhotoCaptured={setMessage} />
    </div>
  );
};

export default CameraComponent;