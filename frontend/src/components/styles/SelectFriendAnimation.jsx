import React, { useRef, useEffect } from 'react';
import lottie from 'lottie-web';
import animationData_1 from '../../library/ChatHomeAnimation_1.json';
import animationData_2 from '../../library/ChatHomeAnimation_2.json';
import { Box } from '@mui/material';

const SelectFriendAnimation = () => {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg', // Render animation in SVG
      loop: true,
      autoplay: true,
      animationData: animationData_1,
    });
  }, []);

  return (
    <Box 
        ref={container} 
        sx={{ 
            width: '60%', 
            height: '60%' 
        }}
    />
  );
};

export default SelectFriendAnimation;
