import IconButton from '@mui/material/IconButton';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';
import React from 'react';

const CameraControls = ({ toggleCamera}) => {
  return (
    <div>
      <IconButton onClick={toggleCamera} aria-label="switch" size="large">
        <CameraswitchOutlinedIcon fontSize='large' color="primary"/>
      </IconButton>
    </div>
  );
};

export default CameraControls;