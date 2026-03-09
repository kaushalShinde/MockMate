
import React from 'react';
import { CircularProgress, Box, Typography } from "@mui/material";

function HomeLoader({ label = "Loading..." }) {
  return (
    <>
        <Box
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="#f0f8ff"
        >
            <CircularProgress color="primary" size={50} />
            <Typography mt={2} fontSize="1.2rem" color="textSecondary">
                {label}
            </Typography>
        </Box>
    </>
  )
}

export default HomeLoader;