
import { Avatar, Box, IconButton, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import axios from 'axios';
import { Check as CheckIcon, Clear as ClearIcon } from '@mui/icons-material';
import { yellow } from '../../constants/colors';
import { server } from '../../constants/config';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarsIcon from '@mui/icons-material/Stars';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

const NotificationItem = ({_id, user, category, notification, requestId=null, status, createdAt, onRemove}) => {
    console.log('rendered NotificationItem.jsx')

    const [notificationBG, setNotificationBG] = useState(status === "unread" ? "#BDC8FF" : "transperent");

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

            // Removes Notificatin from the frontend, (quickly)
            onRemove?.(_id);

        }
        catch (error) {
            console.log(error);
        }

    }
    
    const handleRequestReject = async () => {
        console.log('handleRequestReject', requestId, _id);

        try{
            const config = {
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                }
            }
            const response = await axios.put(`${server}/api/v1/user/rejectrequest`, {
                requestId: requestId,
                deleteNotificationId: _id
            }, config);

            console.log(response?.data);

            // Removes Notificatin from the frontend, (quickly)
            onRemove?.(_id);

        }
        catch (error) {
            console.log(error);
        }

    }
    
    const handleNotificationClick = async () => {

        // user click on notification, mark it as read 
        setNotificationBG("transperent");

        try{
            const config = {
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                }
            }
            
            const response = await axios.put(`${server}/api/v1/user/readNotification`, {
                notificationId: _id,
            }, config);

            console.log(response?.data);

        }
        catch (error) {
            console.log(error);
        }
    }
    
    return (
        <>
            <Stack
                direction={"row"}
                sx={{
                    padding: "5px",
                    margin: '8px',
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: notificationBG,
                }}
                onClick={handleNotificationClick}
            >
                {/* <Avatar 
                    sx={{
                        height: "2rem",
                        width: "2rem",
                        margin: "5px",
                    }}
                    src={user?.avatar?.url} 
                /> */}

                {category === "request" ? (
                    <GroupOutlinedIcon 
                            sx={{
                                height: "2rem",
                                width: "2rem",
                                margin: "5px",
                            }}  
                        />
                    ) : (
                        <StarsIcon 
                            sx={{
                                height: "1.7rem",
                                width: "1.7rem",
                                margin: "5px",
                            }}  
                        />
                    )}


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
                        category !== "request" && (
                            <Typography variant="caption" color="text.secondary">
                                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                            </Typography>
                        )
                    }

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

