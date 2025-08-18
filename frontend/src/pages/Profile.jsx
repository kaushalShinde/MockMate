

import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { sampleuserProfile } from '../library/sampleData';

const Profile = () => {
  const params = useParams();
  const username = params.username;

  const { isMobileScreen } = useSelector((state) => state.misc);

  const user = sampleuserProfile;
  
  // get user profile from the username in the url
  useEffect(() => {
    // get user here
    
  }, [params])
  return (
    <>
      <Container
        component={"main"}
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid black",
          backgroundColor: "blue",
        }}
      >

        <Stack
          direction={"column"}
          sx={{
            height: "100%",
            width: "100%",
            alignItems: "center",
          }}
        >
          
          {/* Main Profile Info */}
          {/* <Box
            sx={{
              height: "40%",
              width: "100%",
              marginTop: "2rem",
              backgroundColor: "yellow",
              border: "2px solid black",
            }}
          > */}
            <Stack
              direction={isMobileScreen ? "column" : "row"}
              sx={{
                height: "25rem",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-evenly",
                backgroundColor: "yellow",
                border: "2px solid black",

              }}
            >
              <Box
                sx={{
                  height: isMobileScreen ? "10rem" : "15rem",
                  width:  isMobileScreen ? "10rem" : "15rem",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                }}
              >
                <Avatar 
                  src={user?.avatar?.url} 
                  sx={{
                    height: "100%",
                    width: "100%",
                  }}  
                />
              </Box>

              <Stack 
                direction={"column"}
                sx={{
                  width: isMobileScreen ? "90%" : "60%",
                  marginLeft: isMobileScreen && "1rem",
                  border: "2px solid black",
                }}
              >

                {/* For Name */}
                <Stack direction={"row"}>
                  <Typography variant={"caption"} 
                    sx={{
                      alignSelf: "flex-end",
                      marginBottom: "0.3rem",
                      marginRight: "0.5rem",
                    }}
                  > name </Typography>
                  <Typography 
                    sx={{
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                    }}
                  > {user?.name} </Typography>
                </Stack>

                {/* For Username */}
                <Stack direction={"row"}>
                  <Typography variant={"caption"} 
                    sx={{
                      alignSelf: "flex-end",
                      marginBottom: "0.3rem",
                      marginRight: "0.5rem",
                    }}
                  > username </Typography>
                  <Typography 
                    sx={{
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                    }}
                  > {user?.username} </Typography>
                </Stack>

                {/* For bio */}
                <Stack direction={"row"}>
                  <Typography variant={"caption"} 
                    sx={{
                      alignSelf: "flex-end",
                      marginBottom: "0.3rem",
                      marginRight: "0.5rem",
                    }}
                  > bio </Typography>
                  <Typography 
                    sx={{
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                    }}
                  > {user?.bio} </Typography>
                </Stack>

                {/* For lastActive */}
                <Stack direction={"row"}>
                  <Typography variant={"caption"} 
                    sx={{
                      alignSelf: "flex-end",
                      marginBottom: "0.3rem",
                      marginRight: "0.5rem",
                    }}
                  > last seen </Typography>
                  <Typography 
                    sx={{
                      fontSize: "1.7rem",
                      fontWeight: "bold",
                    }}
                  > {moment(user?.lastActive).fromNow()} </Typography>
                </Stack>


                {/* For the post Activities */}
                <Stack width={"50%"} direction={"row"} justifyContent={"space-between"}>

                  {/* For totalPosts */}
                  <Stack direction={"row"}>
                    <Typography variant={"caption"} 
                      sx={{
                        alignSelf: "flex-end",
                        marginBottom: "0.3rem",
                        marginRight: "0.5rem",
                      }}
                    > posts </Typography>
                    <Typography 
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    > {user?.posts?.length} </Typography>
                  </Stack>

                  {/* For totalViews */}
                  <Stack direction={"row"}>
                    <Typography variant={"caption"} 
                      sx={{
                        alignSelf: "flex-end",
                        marginBottom: "0.3rem",
                        marginRight: "0.5rem",
                      }}
                    > views </Typography>
                    <Typography 
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    > {user?.totalViews} </Typography>
                  </Stack>

                  {/* For Likes */}
                  <Stack direction={"row"}>
                    <Typography variant={"caption"} 
                      sx={{
                        alignSelf: "flex-end",
                        marginBottom: "0.3rem",
                        marginRight: "0.5rem",
                      }}
                    > likes </Typography>
                    <Typography 
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    > {user?.totalLikes} </Typography>
                  </Stack>
                  
                </Stack>


              </Stack>
            </Stack>

          {/* </Box> */}
        </Stack>
      </Container>


      {/* Here show all the user posts */}


    </>
  )
}

export default Profile;