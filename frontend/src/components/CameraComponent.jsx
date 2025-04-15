import React, { useState, useRef } from 'react';
import VideoStream from './VideoStream';
import CaptureCanvas from './CaptureCanvas';
import CameraControls from './CameraControls';
import { Box, Typography} from '@mui/material';
import SetTheme from './ThemeButton';


export default function CameraComponent() {
  const [message, setMessage] = useState('');
  const [facingMode, setFacingMode] = useState('user');
  const videoRef = useRef(null);

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <Box>
      <VideoStream facingMode={facingMode} onStreamError={setMessage} ref={videoRef} />
      <Box sx={{display:'flex', justifyContent:'space-between'}}>
        <SetTheme/>
        <CaptureCanvas videoRef={videoRef} facingMode={facingMode} onPhotoCaptured={setMessage} />
        <CameraControls  toggleCamera={toggleCamera} />
      </Box>
      <Box>
        {message && <Typography sx={{textAlign:'center'}}>{message}</Typography>}
      </Box>
    </Box>
  );
};
