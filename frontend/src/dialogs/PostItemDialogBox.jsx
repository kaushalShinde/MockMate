
import { ArrowDropUp, Close as CloseIcon, Edit as EditIcon, PersonAdd as PersonAddIcon, HowToReg as HowToRegIcon, RecordVoiceOver as RecordVoiceOverIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { grey, lightYellow, white } from '../constants/colors';
import { server } from '../constants/config';
import { setPostDialogBox, setPost, setPostLikesCount, setPostLikedByUser, setPostLikedColor, setFriendRequestSent, setIsPostCreatorFriendAlready, resetPostState } from '../redux/reducers/post';
import { light } from '@mui/material/styles/createPalette';

const PostItemDialogBox = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const { postDialogBox, post, postLikesCount, postLikedByUser, postLikedColor, friendRequestSent, isPostCreatorFriendAlready } = useSelector((state) => state.post);
    
    console.log('rendered componenet - postItemDialogBox', postDialogBox);

    // const [post, setPost] = useState(null);
    // const [postLikesCount, setPostLikesCount] = useState(0);
    // const [postLikedByUser, setPostLikedByUser] = useState(false);
    // const [postLikedColor, setPostLikedColor] = useState(grey);
    // const [friendRequestSent, setFriendRequestSent] = useState(false);
    // const [isPostCreatorFriendAlready, setIsPostCreatorFriendAlready] = useState(false);


    // todo
    // now only keep add friend and like toggle call in this box, remove other states


    useEffect(() => {
        console.log("##################", friendRequestSent, isPostCreatorFriendAlready);
        // console.log(postDialogBox);
        // setPost(postDialogBox);
        console.log(post);

        // todo
        // axios request to increment view REFETCH POSTS socket
        const config = {
            withCredentials: true,
            headers: {
            "Content-Type": "application/json",
            }
        }

        post && axios.put(`${server}/api/v1/posts/view`, {
                postId: post?._id,
            }, config)
            .then((response) => {
                // console.log(response?.data);
                // setPost(response?.data?.post);
                console.log(post);
            })
            .catch((error) => {        
                toast.error(error?.message || "Something went wrong")
            })


    }, [postDialogBox, dispatch]);


    // useEffect(() => {
    //     if (postDialogBox) {
    //         setPost(postDialogBox);
    //     }
    // }, [postDialogBox]);

    // useEffect(() => {
    //     if (post) {
    //         const config = {
    //             withCredentials: true,
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         };

    //         axios.put(`${server}/api/v1/posts/view`, { postId: post._id }, config)
    //             .then((response) => {
    //                 setPost(response.data.post);
    //             })
    //             .catch((error) => {
    //                 toast.error(error.message || "Something went wrong");
    //             });

    //         isPostLikedByUser();
    //         isPostCreatorFriendHelper();
    //     }
    // }, [post]);




    const handleDialogBoxClose = () => {
        dispatch(resetPostState());

        console.log('handleDialogBoxClose', postDialogBox);

    }

    const handleAddFriend = async () => {
        console.log("handleAddFriend: ", post?.creator?._id);

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        }
        try{
            const response = await axios.put(`${server}/api/v1/user/sendrequest`, {
                userId: post?.creator?._id,
            }, config);

            dispatch(setFriendRequestSent(true));
            toast.success(response?.data?.message);
        }
        catch(error) {
            // console.log(error?.response?.data?.message)
            toast.error(error?.response?.data?.message || "Something went Wrong");
        }
    }

    // const isPostCreatorFriendHelper = async () => {

    //     console.log('checking isAlreadyFriend...');
    //     console.log(post, post?.creator?._id);

    //     if(!post) { 
    //         return;
    //     }
        
    //     try{

    //         const response = await axios.get(`${server}/api/v1/user/isfriend/${post?.creator?._id}`, {
    //             withCredentials: true,
    //         })

    //         if(response?.data?.request){
    //             setFriendRequestSent(true);
    //         }
    //         if(response?.data?.isFriend) {
    //             setIsPostCreatorFriendAlready(true);
    //         }
    //     }
    //     catch(error) {
    //         // console.log(error?.response?.data?.message)
    //         // toast.error(error?.response?.data?.message || "Something went Wrong");
    //     }
    // }

    // const isPostLikedByUser = async () => {

    //     const isLiked = post?.likes?.includes(user?._id);
    //     isLiked && setPostLikedColor(lightYellow);
    //     setPostLikedByUser(isLiked);
    // }

    const toggleLikePost = async () => {

        try{
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            }
            const response = await axios.put(`${server}/api/v1/posts/like`, {
                postId: post?._id
            }, config);

            if(response?.data?.success){
                if(postLikedByUser) {
                    dispatch(setPostLikedByUser(false));
                    dispatch(setPostLikedColor(grey));
                    dispatch(setPostLikesCount(postLikesCount - 1));
                }
                else {
                    dispatch(setPostLikedByUser(true));
                    dispatch(setPostLikedColor("yellow"));
                    dispatch(setPostLikesCount(postLikesCount + 1));
                }
            }
            else {
                toast.error(response?.data?.message || "Something went wrong!!");
            }
        }
        catch(error) {
            toast.error(error?.response?.data?.message || "Something went Wrong");
        }
    }

    const redirectToProfilePage = () => {
        navigate(`/profile/${post?.creator?.username}`);
    }

    // useEffect(() => {
    //     // setPostLikesCount(post?.likes?.length);
    //     // isPostLikedByUser();
    //     // isPostCreatorFriendHelper();
    // }, [post]);
      

  return (
    <>
      <Dialog
        open={postDialogBox !== null}
        onClose={handleDialogBoxClose}
            BackdropProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent black
                    backdropFilter: 'blur(7px)',  // Blur effect
                }
            }}
      >
        <DialogActions> 
            <Stack direction={"row"} >
                <Box flexGrow={8} />
                <IconButton onClick={handleDialogBoxClose}>
                    <CloseIcon />
                </IconButton>
            </Stack>
        </DialogActions>


        <DialogContent 
            sx={{
                overflow: "hidden",
                scrollbarWidth: "none",
            }}
        >
            <Stack 
                direction={"row"} 
                spacing={"1rem"}
                sx={{
                    alignItems: "center",
                    // border: "2px solid red",
                }}
            >
                <Avatar src={post?.creator?.avatar?.url} onClick={redirectToProfilePage} />

                <Stack direction={"column"}>
                    <Typography variant={"h6"} onClick={redirectToProfilePage} > {post?.creator?.username} </Typography>
                    <Typography variant={"caption"} > {moment(post?.createdAt).format('Do MMM YYYY, hh:mm a')} </Typography>
                </Stack>

                {!isPostCreatorFriendAlready && 
                    <IconButton 
                        sx={{
                            alignSelf: "flex-start"
                        }}
                        onClick={handleAddFriend}
                    >
                        {friendRequestSent 
                            ? <HowToRegIcon />
                            : <PersonAddIcon />
                        }
                    </IconButton>
                }

                <Box flexGrow={8} />

                <Stack direction={"row"} >
                    <Typography sx={{display: 'flex', alignItems: 'center', opacity: "0.6", cursor: "default"}}>
                        <VisibilityIcon 
                            sx={{
                                marginLeft: "1rem",
                                marginRight: "0.5rem",
                            }}
                        />
                        <Typography > {post?.views} </Typography>
                    </Typography>

                    <IconButton 
                        onClick={toggleLikePost}
                    >
                        <ArrowDropUp 
                            color={"success"}
                            sx={{
                                fontSize: "3rem",
                                color: postLikedColor,
                                marginLeft: "0rem",
                                // marginRight: "0.3rem",
                            }}
                        />
                        <Typography marginLeft={"0.1rem"}> {postLikesCount} </Typography>
                    </IconButton>
                </Stack>

                <IconButton>
                </IconButton>

                
            </Stack>
        </DialogContent>

        <DialogContent
            sx={{
                overflow: "auto",
                scrollbarWidth: "none",
            }}
        >
            <Typography 
                sx={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                }}
            > {post?.title} </Typography> 

            <Typography variant={"caption"}> Description </Typography>
            
            <Typography 
                sx={{
                    fontSize: "1rem",
                }}
            > {post?.description} </Typography> 
        </DialogContent>

        
        {/* TODO =>  edit post */}
        {/* <DialogActions>
            <IconButton>
                <EditIcon />
            </IconButton>
        </DialogActions> */}

      </Dialog>
    </>
  )
}

export default PostItemDialogBox;
