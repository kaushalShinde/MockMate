

import { Box, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import CreatePost from '../components/specific/CreatePost';
import PostList from '../components/specific/PostList';
import { pinkWhite } from '../constants/colors';
import { server } from '../constants/config';
import PostItemDialogBox from '../dialogs/PostItemDialogBox';
import { samplePostsData } from '../library/sampleData';
import { useSelector } from 'react-redux';


const Home = () => {
  // const { postDialogBox, post } = useSelector((state) => state.post);

  const [posts, setPosts] = useState(samplePostsData);
  useEffect(() => {

    axios.get(`${server}/api/v1/posts/1`)
      .then((data) => {
        setPosts(data.data.posts);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      })
  }, []);


  const tmp = {
    username: "asdfg",
  }

  return (
    <>
      <Header />


      {/* Why it this shown here => coz the number of post item the number of times this component gets loaded , so made the selected post in redux to access */}
      <PostItemDialogBox />

      {/* todo => May be i will show here all show in all pages  */}
      

      
      <Grid
        container
        height={"calc(99vh - 4rem)"}
        className={"home-background"} // bg color animation- like aws 
        sx={{
          overflow: 'hidden',
        }}
      >

        {/* Left Black column  */}
        <Grid
          item
          xs={0}
          sm={0}
          md={3}
          sx={{
            display: {
              xs: "none",
              sm: 'none',
              md: 'block',
            },
            height: '100%',
            // backgroundColor: "#B8FFF9",
            
            // background: 'linear-gradient(160deg, #C3F8FF, #ABD9FF)',
            // border: "2px solid black",
          }}
        >

        </Grid>


        {/* middle (main) column  */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          sx={{
            display: {
              sm: 'block',
              xs: 'block',
            },
            height: '100%',
            // border: "1px solid black",
            // bgcolor: "#F3F8FF",
          }}
        >
          <PostList />
        </Grid>


        {/* right side column  */}
        <Grid
          item
          xs={0}
          sm={4}
          md={4}
          sx={{
            display: {
              xs: "none",
              md: "block",
              sm: 'block',
            },
            height: '100%',
            // background: 'linear-gradient(160deg, #EEF5FF, #DDDDDD)',
            // border: "2px solid black",
          }}
        >

          <CreatePost />

          {/* <Box 
            // flexGrow={8} 
            // flexDirection={"row"} 
            sx={{
              height: "60%",
              border: "2px solid black",
              backgroundColor: "green"
            }}  
          /> */}
          {/* <Typography
            sx={{
              marginLeft: "8rem",
              alignSelf: "center",
              justifySelf: "center",
              color: pinkWhite,
            }}
          > Made with 🤎 by kaushalShinde </Typography> */}
        </Grid>

      </Grid>
      
    </>
  )
}

export default Home