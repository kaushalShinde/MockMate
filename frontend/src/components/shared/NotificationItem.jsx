
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import axios from 'axios';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { yellow } from '../../constants/colors';
import { server } from '../../constants/config';

const NotificationItem = ({_id, user, category, notification, requestId=null, status}) => {
    console.log('rendered NotificationItem.jsx')

    const handleRequestAccept = async () => {
        console.log('handleRequestAccept', requestId, _id);

        try{
            const config = {
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                }
            }
            const response = await axios.put(`${server}/api/v1/user/acceptrequest`, {
                requestId: requestId,
                deleteNotificationId: _id
            }, config);

            console.log(response?.data);

        }
        catch (error) {
            console.log(error);
        }

    }
    
    const handleRequestReject = async () => {
        console.log('handleRequestReject');
    }
    
    return (
        <>
            <Stack
                direction={"row"}
                sx={{
                    padding: "5px",
                    margin: '8px',
                    alignItems: "center",
                    // justifyContent: "space-between",
                    // border: "2px solid black",
                }}
            >
                <Avatar 
                    sx={{
                        height: "2rem",
                        width: "2rem",
                        margin: "5px",
                    }}
                    src={user?.avatar?.url} 
                />

                <Stack
                    direction={"row"}
                    width={"100%"}
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <Typography 
                        // alignSelf={"center"}
                        sx={{
                            marginLeft: "10px",
                        }}
                    > {notification} </Typography>


                    {
                        category === "request" && (
                            <Stack
                                direction={"row"}
                            >
                                <IconButton onClick={handleRequestAccept} >
                                    <CheckIcon color={"primary"} />
                                </IconButton>

                                <IconButton onClick={handleRequestReject} >
                                    <ClearIcon color={"error"} />
                                </IconButton>
                            </Stack>
                        )
                    }

                </Stack>

            </Stack>

        </>
    )
}

export default NotificationItem;

