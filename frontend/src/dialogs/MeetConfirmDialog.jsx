
import '../App.css';
import { Button, Dialog, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMeetRequestAccepted, setMeetConfirmationDialogBox } from '../redux/reducers/meet';


const MeetConfirmDialog = () => {

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { meetConfirmationDialogBox, meetRequest } = useSelector((state) => state.meet);
    const request = meetRequest;


    const handleCancelRequest = () => {
        console.log('handleCancelRequest')

        dispatch(setIsMeetRequestAccepted(false));
        dispatch(setMeetConfirmationDialogBox(false));
    }
    const handleAcceptRequest = () => {
        console.log('handleAcceptRequest')
        dispatch(setIsMeetRequestAccepted(true));
        dispatch(setMeetConfirmationDialogBox(false));
        
    }

    // console.log(meetConfirmationDialogBox, meetRequest?.receiver?._id, user?._id, (meetRequest?.receiver?._id === user?._id));
  return (
    <>
        <Dialog
            open={meetConfirmationDialogBox && (meetRequest?.receiver?._id === user?._id)}
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
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                {/* todo => show waiting animation here */}
                {/* <div className="lds-ripple" margin={"1rem"}><div></div><div></div></div> */}
                <div className="loader"> </div>
                
                <Typography>
                    {`${request?.sender?.username} wants to schedule a video call for the mock interview.`}
                </Typography>
                <Typography variant={"caption"}>
                    {"Are you available?"}
                </Typography>

                <Stack
                    direction={"row"}
                    sx={{
                        width: "100%",
                        margin: "1rem",
                        alignItems: "center",
                        justifyContent: "space-around",
                    }}
                >
                    {/* Close Request */}
                    <Button 
                        onClick={handleCancelRequest}
                        variant={"contained"} 
                        color={"error"} 
                        margin={"1rem"}
                    >
                        Cancel
                    </Button>

                    
                    {/* Accept Request */}
                    <Button 
                        onClick={handleAcceptRequest}
                        variant={"contained"} 
                        // color={"success"} 
                        sx={{
                            backgroundColor: "#FFB000",
                        }}
                        margin={"1rem"}
                    >
                        Accept
                    </Button>
                </Stack>
               

            </Stack>


        </Dialog>
      
    </>
  )
}

export default MeetConfirmDialog;
