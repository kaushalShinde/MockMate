
import { Box, Skeleton } from '@mui/material'
import React from 'react'

function PostLoader() {
    console.log("Rendered Component: PostLoader.jsx");

  return (
    <>
        <Box sx={{ width: "100%" }}>
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
            <Skeleton animation="wave" variant="rounded" sx={{ backgroundColor: "#ccc", width: "100%", height: "4rem", margin: "1rem" }} />  
        </Box>
    </>
  )
}

export default PostLoader;
