

import { Stack, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import PostItem from '../shared/PostItem';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';
import { useSocket } from '../../socket';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { setPostAddedByMe } from '../../redux/reducers/misc';

import PostLoader from '../../loaders/PostLoader';
import ErrorMessage from '../../loaders/ErrorLoader';

const PostList = () => {

    const socket = useSocket();
    const dispatch = useDispatch();

    const { refetchPostList, postAddedByMe } = useSelector((state) => state.misc);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchPosts = useCallback(async () => {
        console.log("FETCH POSTS")
        try {
            const response = await axios.get(`${server}/api/v1/posts/${page}`);
            console.log(response)

            setPosts((prevPosts) => [...prevPosts, ...response?.data?.posts]);
            setTotalPages(response?.data?.totalPages);
            setTotalPosts(response?.data?.totalPosts);
            setPage((prev) => prev + 1);

            console.log("PostList: ", {posts, totalPages, totalPosts});
        } catch (err) {
            setError(err?.response?.data?.message  || "Something went wrong");
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }

    }, [page]);


    const handleFetchNewPosts = useCallback(() => {
        console.log('handleFetchNewPosts');
        setPage(1);
        setPosts([]);

        fetchPosts();
    }, []);


    // this is inefficient as if user created post, whole list is again fetched only to add the user's own post in it
    // instead we take post and in frontend only add the post in postList
    // useEffect(() => {
    //     handleFetchNewPosts();
        // fetchPosts();
    // }, [refetchPostList]);

    
    // Initial Fetch when component mounts
    // useEffect(() => {
    //     handleFetchNewPosts();
    //     // fetchPosts();
    // }, [refetchPostList]);

    useEffect(() => {
        handleFetchNewPosts();
        // fetchPosts();
    }, [])

    useEffect(() => {
        if(postAddedByMe != null || postAddedByMe != undefined) {
            setPosts((prev) => [postAddedByMe, ...prev]);
        }
        dispatch(setPostAddedByMe(null));
    }, [refetchPostList]);

    // Loader until fetching posts
    if(loading) {
        return <PostLoader />
    }
    if(error) {
        return <ErrorMessage retry={fetchPosts} message={error} />
    }
    if (loading === false && posts.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" height="100%">
                <Typography> No posts found. </Typography>
            </Stack>
        );
    }

  return (
    <>
        <Stack
            id="scrollableStack"
            height={"100%"}
            width={'100%'}
            direction={"column"}
            sx={{
                overflow: "auto",
                '&::-webkit-scrollbar': {
                    display: 'none',  // For Chrome, Safari, and Opera
                },
                scrollbarWidth: 'none',
            }}
        >

            <InfiniteScroll
                dataLength={posts.length}   // this is current number of posts
                hasMore={ posts.length < totalPosts }
                next={fetchPosts}
                scrollableTarget="scrollableStack"

                // TODO => change below and add some better components
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                    </p>
                }
            >
                {
                    posts.map((data, index) => {
                        return <PostItem key={index} postData={data} />
                    })
                }
            </InfiniteScroll>
            

        </Stack>
    </>
  )
}

export default PostList;