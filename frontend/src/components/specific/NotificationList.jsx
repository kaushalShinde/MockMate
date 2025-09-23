
import { Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationItem from '../shared/NotificationItem'

import axios from 'axios';
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';


const NotificationList = () => {

  const [notifications, setNotifications] = useState([]);
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const getNotifications = async () => {
      try{
          const config = {
              withCredentials: true,
              headers: {
                  "Content-Type": "application/json",
              }
          }
          const response = await axios.get(`${server}/api/v1/user/notifications`, config);
          // console.log(response?.data?.allNotifications);

          setNotifications(response?.data?.allNotifications);
      }
      catch (error) {
          console.log(error)
          toast.error(error?.response?.data);
      }
  }

  const removeNotificationFromList = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification._id !== id));
  };
  

  useEffect(() => {
     getNotifications(); 
  }, [])

  return (
    <>      
        <Stack
            direction={"column"}
            sx={{
                width: "28rem",
                // border: "2px solid black",
            }}
        >
          {notifications.length > 0 ? (

            notifications.map(({_id, user, category, notification, requestId=null, status, createdAt}) => {
              
              return <NotificationItem 
                key={_id}
                _id={_id}
                user={user} 
                category={category}
                notification={notification}
                requestId={requestId}
                status={status}
                createdAt={createdAt}
                onRemove={removeNotificationFromList}
              />
            })
          ) : (
            <Typography> No Notifications. </Typography>
          )}
        </Stack>
      
    </>
  )
}

export default NotificationList
