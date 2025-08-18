

import { Stack } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import PostItem from '../shared/PostItem';
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';
import { useSocket } from '../../socket';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';

const PostList = () => {

    const socket = useSocket();
    const dispatch = useDispatch();

    const { refetchPostList } = useSelector((state) => state.misc);

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchPosts = useCallback(async () => {
        console.log("FETCH POSTS")
        try {
            const response = await axios.get(`${server}/api/v1/posts/${page}`);

            console.log(response?.data);

            setPosts((prevPosts) => [...prevPosts, ...response?.data?.posts]);
            setTotalPages(response?.data?.totalPages);
            setTotalPosts(response?.data?.totalPosts);
            setPage((prev) => prev + 1);

            console.log(posts, totalPages, totalPosts);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        }
    }, [page]);


    const handleFetchNewPosts = useCallback(() => {
        console.log('handleFetchNewPosts');
        setPage(1);
        setPosts([]);

        fetchPosts();
    }, []);

    // useEffect(() => {
    //     handleFetchNewPosts();

    // }, [refetchPostList]);

    
    // Initial Fetch when component mounts
    useEffect(() => {
        handleFetchNewPosts();
        // fetchPosts();
    }, [refetchPostList]);

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
                        return <PostItem key={index} post={data} />
                    })
                }
            </InfiniteScroll>
            

        </Stack>
    </>
  )
}

export default PostList;