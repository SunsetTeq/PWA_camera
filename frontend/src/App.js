import React from 'react';
import CameraComponent from './components/CameraComponent';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import { ThemeProvider} from '@mui/material/styles';
import {containerStyles, boxStyles} from './styles/App_styles';
import theme from './styles/Theme'


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={containerStyles}>
        <Box sx={boxStyles}>
          <Typography variant="h5" align='center'>☆*: Рассчитать площадь :*☆</Typography>
          <CameraComponent />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
