
import '../App.css';
import { Button, Dialog, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSendMeetRequestDialogBox } from '../redux/reducers/meet';
import { useSocket } from '../socket';
import { formatDateMinutes } from '../library/functions';


const MeetRequestDialog = () => {

    const socket = useSocket();
    const dispatch = useDispatch();

    const { sendMeetRequestDialogBox, meetRequest } = useSelector((state) => state.meet);
    const request = meetRequest;


    const handleCancelRequest = () => {

        dispatch(setSendMeetRequestDialogBox(false));
    }

    // useEffect(() => {
    
    //     // todo => socket working
    //     socket.emit('TEST_ZEGO', {request});
    //     socket.on('TESTED_ZEGO', (data) => {
    //         console.log('TESTED_ZEGO', data);
    //     })
    
    //   }, [socket]);

  return (
    <>
        <Dialog
            open={sendMeetRequestDialogBox}
            onClose={handleCancelRequest}
        >

            <Stack
                direction={"column"}
                sx={{
                    padding: "1rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >

                {/* Top Close Icon */}
                <IconButton
                    aria-label="close"
                    onClick={handleCancelRequest}
                    sx={{
                        // display: "block",
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* todo => show waiting animation here */}
                <div className="lds-ripple" margin={"2rem"}><div></div><div></div></div>

                {
                    (formatDateMinutes(request?.receiver?.lastActive) == 'Active') ? (
                        <Typography margin={"1rem"}>
                            {`Meeting request sent to ${request?.receiver?.username ?? "our friend"}, please wait.`}
                        </Typography>
                    ) : (
                        <Typography margin={"1rem"}>
                        {`${request?.receiver?.username}'s currently offline, unable to take requests right now`}
                        </Typography>
                    )
                }

                {/* Close Request */}
                <Button 
                    onClick={handleCancelRequest}
                    variant={"contained"} 
                    color={"error"} 
                    margin={"1rem"}
                >
                    Cancel
                </Button>

            </Stack>


        </Dialog>
      
    </>
  )
}

export default MeetRequestDialog
