

import React, { useState, useEffect } from 'react';
import { Avatar, Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { formatDate, setTitleFont } from '../../library/functions';
import PostItemDialogBox from '../../dialogs/PostItemDialogBox';
import { useDispatch, useSelector } from 'react-redux';
import { setPostDialogBox } from '../../redux/reducers/misc';


const PostItem = ({post}) => {
    // console.log('rendered componenet - postItem');
    // console.log(post);
    const dispatch = useDispatch();

    // for post item dialog box
    const { postDialogBox } = useSelector((state) => state.misc);

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


    const handlePostDialogOpen = () => {
        console.log(post);
        dispatch(setPostDialogBox(post));

        console.log('handlePostDialogOpen', postDialogBox);
    }
    const handlePostDialogClose = () => {
        dispatch(setPostDialogBox(null));
        
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
            border: "2px solid black",
            // borderRadius: "5px",
            // margin: "2px 0",
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
                    cursor: "pointer",
                }}
                src={post?.creator?.avatar?.url}     
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
                        fontSize: "1.5rem",
                        fontWeight: 'bold',
                        marginTop: "0.5rem",
                        cursor: "pointer",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    { post?.title + '...' }
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
                    > {post?.creator?.username} {""} </Typography>

                    {/* Post time ago */}
                    <Typography
                        sx={{
                            fontSize: '0.7rem',
                            marginBottom: '0rem',
                            marginTop: '0.4rem',
                            marginLeft: '0.5rem',
                            // borderBottom: "1px solid purple",
                        }}
                    > {""} Created At: { formatDate(post?.createdAt)} </Typography>

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

export default PostItem;
