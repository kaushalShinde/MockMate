

import React, { useState, useEffect } from 'react';
import { Avatar, Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { formatDate, setTitleFont } from '../../library/functions';
import PostItemDialogBox from '../../dialogs/PostItemDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { setPostDialogBox, setPost, setPostLikedByUser, setPostLikedColor, setFriendRequestSent, setIsPostCreatorFriendAlready, setPostLikesCount, resetPostState } from '../../redux/reducers/post';
import axios from 'axios';
import { server } from '../../constants/config';

const PostItem = ({ postData }) => {
    // console.log('rendered componenet - postItem');
    
    const dispatch = useDispatch();
    
    const { user } = useSelector((state) => state.auth);

    // for post item dialog box - 'post' redux state
    const { postDialogBox, post, postLikedByUser, postLikedColor, friendRequestSent, isPostCreatorFriendAlready } = useSelector((state) => state.post);

    // For the responsiveness of app
    const [titleLimit, setTitleLimit] = useState(30);
    const [fontLimit, setFontLimit] = useState('1.5rem');
    const [dateLimit, setDateLimit] = useState(100);

    // checks screen size
    // const screen11300px = useMediaQuery('(min-width:1300)');
    // const screen1150px = useMediaQuery('(min-width:1150px) and (max-width: 1300px)');
    // const screen900px = useMediaQuery('(min-width:900px) and (max-width: 1150px)');
    // const screen700px = useMediaQuery('(min-width:700px) and (max-width: 900px)');
    // const screen600px = useMediaQuery('(min-width:600px) and (max-width: 700px)');
    // const screen500px = useMediaQuery('(min-width:485px) and (max-width: 600px)');
    // const screen300px = useMediaQuery('(min-width:300px) and (max-width: 485px)');


    // // on screen size change
    // useEffect(() => {
    //     const {titleSize, fontSize, dateLimit} = setTitleFont(screen11300px, screen1150px, screen900px, screen700px, screen600px, screen500px, screen300px);

    //     setTitleLimit(titleSize);
    //     setFontLimit(fontSize);
    //     setDateLimit(dateLimit);

    // }, [screen11300px, screen1150px, screen900px, screen700px, screen600px, screen500px, screen300px])


    const isPostCreatorFriendHelper = async ( postData ) => {

        if(!postData) { 
            return;
        }
        
        try{
            const response = await axios.get(`${server}/api/v1/user/isfriend/${postData?.creator?._id}`, {
                withCredentials: true,
            })

            console.log(" isPostCreatorFriendHelper ", response?.data);
            if(response?.data?.request){
                dispatch(setFriendRequestSent(true));
            }
            if(response?.data?.isFriend) {
                dispatch(setIsPostCreatorFriendAlready(true));
            }
        }
        catch(error) {
            // console.log(error?.response?.data?.message)
            // toast.error(error?.response?.data?.message || "Something went Wrong");
        }
    }

    const handlePostDialogOpen = async () => {
        console.log("####################################")
        console.log(postData);

        // todo 
        // take logged user from redux

        dispatch(setPostDialogBox(true));       // open dialog
        dispatch(setPost(postData));                 // set current post
        dispatch(setPostLikesCount(postData?.likes?.length || 0));       // set likes count
        dispatch(setPostLikedByUser(postData?.likes?.includes(user?._id) ? 1 : 0));  // liked by user
        dispatch(setPostLikedColor(postData?.likes?.includes(user?._id) ? "yellow" : "grey")); // like color

        // todo
        // call api here only to check if friends
        await isPostCreatorFriendHelper(postData);

        // dispatch(setFriendRequestSent(false));   // reset friend request sent
        // dispatch(setIsPostCreatorFriendAlready(false)); // reset friendship status
        
        console.log('handlePostDialogOpen', postDialogBox);
    }
    const handlePostDialogClose = () => {
        dispatch(resetPostState());
        
        console.log('handlePostDialogClose', postDialogBox);
    }



  return (
    <>
        {/* Post Item Dialog box */}
        {/* Moved this component to Home.jsx */}
        {/* <PostItemDialogBox 
            post={post}
            onOpen={handlePostDialogOpen}
            onClose={handlePostDialogClose}
        /> */}


      <Box
        sx={{
            // display: "flex",
            border: "1px solid purple",
            borderRadius: "5px",
            margin: "5px 0",
            // background: 'linear-gradient(175deg, #E5D9F2, #F5EFFF, #E5D9F2)',
            background: "#E8F9FF",
            // background: "transparent",
        }}
        onClick={handlePostDialogOpen}
      >
        


        <Stack direction={'row'} height={'5rem'} alignItems={"center"}>

            {/* Profile Avatar */}
            <Avatar 
                sx={{
                    height: '3rem',
                    width: '3rem',
                    // marginTop: '1rem',
                    marginLeft: '1rem',
                    marginRight: '1.6rem',
                    border: "1px solid black",
                    cursor: "pointer",
                }}
                src={postData?.creator?.avatar?.url}     
            />

            {/* The Middle part of the post Item (used more stack to just align in way) */}
            <Stack 
                direction={'column'}
                sx={{
                    // border: "2px solid black",
                    width: "90%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                }}
            >
            
                {/* Post Title */}

                <Typography
                    variant="h5" 
                    sx={{
                        fontSize: "1.2rem",
                        fontWeight: 'bold',
                        marginTop: "0.5rem",
                        cursor: "pointer",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    { postData?.title }
                </Typography>
                

                {/* It's the bottom of the post item */}
                <Stack direction={'row'} >

                    {/* Post creator */}
                    <Typography
                        sx={{
                            fontSize: '1rem',
                            marginBottom: '0rem',
                            cursor: "pointer",
                            // borderBottom: "1px solid purple",
                        }}
                    > {postData?.creator?.username} {""} </Typography>

                    {/* Post time ago */}
                    <Typography
                        sx={{
                            fontSize: '0.7rem',
                            marginBottom: '0rem',
                            marginTop: '0.4rem',
                            marginLeft: '0.5rem',
                            // borderBottom: "1px solid purple",
                        }}
                    > {""} Created At: { formatDate(postData?.createdAt)} </Typography>

                </Stack>
            </Stack>

            {/* <Box sx={{
                flexGrow: 1,
                margin: '4rem'
            }} /> */}
            
            {/* Post Views */}
            {/* <VisibilityIcon 
                sx={{
                    border: "2px solid blue",
                    position: 'sticky',
                    right: '1rem',
                    alignSelf: 'flex-end',
                    marginRight: '0rem',
                }}
            /> */}

        </Stack>
      </Box>
    </>
  )
}

export default React.memo(PostItem);
