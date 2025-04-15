import React, { forwardRef } from 'react';
import useCamera from '../hooks/useCamera';

const VideoStream = forwardRef(({ facingMode, onStreamError }, ref) => {
    const videoRef = useCamera(facingMode, onStreamError, ref);

  return (
    <video
      ref={videoRef}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
      }}
      autoPlay
      muted
      playsInline
    />
  );
});

export default VideoStream;