import {
    ArrowDropUp,
    Close as CloseIcon,
    PersonAdd as PersonAddIcon,
    HowToReg as HowToRegIcon,
    Visibility as VisibilityIcon
  } from '@mui/icons-material';
  import {
    Avatar,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    Typography
  } from '@mui/material';
  import axios from 'axios';
  import moment from 'moment';
  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import toast from 'react-hot-toast';
  import { useDispatch, useSelector } from 'react-redux';
  import { grey, lightYellow } from '../constants/colors';
  import { server } from '../constants/config';
  import { setPostDialogBox } from '../redux/reducers/misc';
  
  const PostItemDialogBox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { user } = useSelector((state) => state.auth);
    const { postDialogBox } = useSelector((state) => state.misc);
  
    // local UI state
    const [post, setPost] = useState(null); // full post object (fresh from server if we fetch)
    const [likesCount, setLikesCount] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [likeColor, setLikeColor] = useState(grey);
  
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [isPostCreatorFriendAlready, setIsPostCreatorFriendAlready] = useState(false);
  
    // helper: reset all local UI state to defaults
    const resetLocalState = () => {
      setPost(null);
      setLikesCount(0);
      setLikedByUser(false);
      setLikeColor(grey);
      setFriendRequestSent(false);
      setIsPostCreatorFriendAlready(false);
    };
  
    // When postDialogBox changes (open/close or different post),
    // we reset and optionally fetch latest post data from server.
    useEffect(() => {
      // if dialog closed
      if (!postDialogBox) {
        resetLocalState();
        return;
      }
  
      // set a basic post immediately (so UI shows something)
      setPost(postDialogBox);
  
      // initialize UI from passed postDialogBox
      const initLikes = postDialogBox?.likes?.length || 0;
      const isLiked = !!(postDialogBox?.likes?.includes && postDialogBox?.likes?.includes(user?._id));
      setLikesCount(initLikes);
      setLikedByUser(isLiked);
      setLikeColor(isLiked ? lightYellow : grey);
  
      setFriendRequestSent(false);
      setIsPostCreatorFriendAlready(false);
  
      // Optional: fetch the fresh post from server to ensure likes/views are up-to-date.
      // If you don't want an extra request, remove this block.
      (async () => {
        try {
          const config = { withCredentials: true };
          const res = await axios.get(`${server}/api/v1/posts/${postDialogBox._id}`, config);
          // Assume response returns single post in res.data.post (adjust if API differs)
          const freshPost = res?.data?.post || postDialogBox;
          setPost(freshPost);
  
          const freshLikes = freshPost?.likes?.length || 0;
          const freshIsLiked = !!(freshPost?.likes?.includes && freshPost?.likes?.includes(user?._id));
          setLikesCount(freshLikes);
          setLikedByUser(freshIsLiked);
          setLikeColor(freshIsLiked ? lightYellow : grey);
  
          // If you have friend check endpoint, call helper to set friend state
          await checkFriendStatusHelper(freshPost);
        } catch (err) {
          // If fetch fails, keep using the passed postDialogBox values
          // but still attempt friend check
          await checkFriendStatusHelper(postDialogBox);
        }
      })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postDialogBox, user?._id]);
  
    // helper to set friend status (moved here so we can call from useEffect)
    const checkFriendStatusHelper = async (p) => {
      if (!p || !p.creator?._id) return;
      try {
        const response = await axios.get(`${server}/api/v1/user/isfriend/${p.creator._id}`, { withCredentials: true });
        if (response?.data?.request) setFriendRequestSent(true);
        if (response?.data?.isFriend) setIsPostCreatorFriendAlready(true);
      } catch (error) {
        // silent
      }
    };
  
    const handleDialogBoxClose = () => {
      dispatch(setPostDialogBox(null));
      resetLocalState();
    };
  
    const handleAddFriend = async () => {
      if (!post?.creator?._id) return;
      try {
        const response = await axios.put(`${server}/api/v1/user/sendrequest`, {
          userId: post.creator._id
        }, { withCredentials: true });
        setFriendRequestSent(true);
        toast.success(response?.data?.message || 'Request sent');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not send request');
      }
    };
  
    const toggleLikePost = async () => {
      if (!post?._id) return;
      try {
        const response = await axios.put(`${server}/api/v1/posts/like`, { postId: post._id }, { withCredentials: true });
  
        // Update local UI optimistically based on current local liked state:
        if (likedByUser) {
          setLikedByUser(false);
          setLikeColor(grey);
          setLikesCount((prev) => Math.max(0, prev - 1));
        } else {
          setLikedByUser(true);
          setLikeColor(lightYellow);
          setLikesCount((prev) => prev + 1);
        }
  
        // Optional: if server returns updated post, sync local post object
        if (response?.data?.post) {
          setPost(response.data.post);
          const serverLikes = response.data.post.likes?.length || 0;
          const serverIsLiked = !!(response.data.post.likes?.includes && response.data.post.likes.includes(user?._id));
          setLikesCount(serverLikes);
          setLikedByUser(serverIsLiked);
          setLikeColor(serverIsLiked ? lightYellow : grey);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Could not toggle like');
      }
    };
  
    const redirectToProfilePage = () => {
      navigate(`/profile/${post?.creator?.username}`);
    };
  
    return (
      <Dialog
        open={postDialogBox !== null}
        onClose={handleDialogBoxClose}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(7px)'
          }
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogActions>
          <Stack direction={'row'}>
            <Box flexGrow={8} />
            <IconButton onClick={handleDialogBoxClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogActions>
  
        <DialogContent sx={{ overflow: 'hidden', scrollbarWidth: 'none' }}>
          <Stack direction={'row'} spacing={'1rem'} sx={{ alignItems: 'center' }}>
            <Avatar src={post?.creator?.avatar?.url} onClick={redirectToProfilePage} />
  
            <Stack direction={'column'}>
              <Typography variant={'h6'} onClick={redirectToProfilePage}>
                {post?.creator?.username}
              </Typography>
              <Typography variant={'caption'}>{moment(post?.createdAt).format('Do MMM YYYY, hh:mm a')}</Typography>
            </Stack>
  
            {!isPostCreatorFriendAlready && (
              <IconButton sx={{ alignSelf: 'flex-start' }} onClick={handleAddFriend}>
                {friendRequestSent ? <HowToRegIcon /> : <PersonAddIcon />}
              </IconButton>
            )}
  
            <Box flexGrow={8} />
  
            <Stack direction={'row'}>
              <Typography sx={{ display: 'flex', alignItems: 'center', opacity: 0.6, cursor: 'default' }}>
                <VisibilityIcon sx={{ marginLeft: '1rem', marginRight: '0.5rem' }} />
                <Typography>{post?.views ?? 0}</Typography>
              </Typography>
  
              <IconButton onClick={toggleLikePost}>
                <ArrowDropUp
                  sx={{
                    fontSize: '3rem',
                    color: likeColor,
                    marginLeft: '0rem'
                  }}
                />
                <Typography marginLeft={'0.1rem'}>{likesCount}</Typography>
              </IconButton>
            </Stack>
          </Stack>
        </DialogContent>
  
        <DialogContent sx={{ overflow: 'auto', scrollbarWidth: 'none' }}>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{post?.title}</Typography>
  
          <Typography variant={'caption'}> Description </Typography>
  
          <Typography sx={{ fontSize: '1rem' }}>{post?.description}</Typography>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default PostItemDialogBox;
  