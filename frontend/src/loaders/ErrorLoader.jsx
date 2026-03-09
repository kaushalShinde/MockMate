
import React from 'react';

import { Button, Typography, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function ErrorMessage({ retry, message = "Something went wrong!" }) {
    
    console.log("Rendered Component: ErrorMessage.jsx");
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={4}
      textAlign="center"
    >
      <Typography variant="h6" color="error" gutterBottom>
        {message}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={retry}
      >
        Try Again
      </Button>
    </Box>
  );
}

export default ErrorMessage;
