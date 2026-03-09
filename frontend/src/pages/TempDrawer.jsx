import { Button, Drawer, SwipeableDrawer } from '@mui/material';
import React, { useState } from 'react';

const TempDrawer = () => {
    
    const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setIsChatDrawerOpen((prev) => !prev);
    }

    return (
        <>
            <Button onClick={toggleDrawer}> Show </Button>
            <SwipeableDrawer
                anchor={"left"}
                open={isChatDrawerOpen}
                onOpen={toggleDrawer}
                onClose={toggleDrawer}
                direction={'left'}
            >

            </SwipeableDrawer>
        </>
    )
}

export default TempDrawer;