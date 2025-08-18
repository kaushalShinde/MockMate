

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { pinkWhite } from '../../constants/colors';
import { setIsMobileScreen, setRefetchPostList } from '../../redux/reducers/misc';
import { useSelector, useDispatch } from 'react-redux';


const CreatePost = () => {

    const dispatch = useDispatch();

    const { refetchPostList } = useSelector((state) => state.misc);

    const { isMobileScreen } = useSelector((state) => state.misc);
    const [isTitleError, setTitleError] = useState(false);
    const [isDescriptionError, setDescriptionError] = useState(false);

    const titleLimit = 50, descriptionLimit = 300;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (e) => {
        let input = e.target.value;
        
        if(title.length < titleLimit) {
            setTitle(e.target.value);
        }
        else {
            input = input.substring(0, titleLimit);
            setTitle(input);
        }
    }

    const handleDescriptionChange = (e) => {
        let input = e.target.value;

        if(description.length < descriptionLimit) {
            setDescription(e.target.value);
        }
        else {
            input = input.substring(0, descriptionLimit);
            setDescription(input);
        }
    }

    const submitPostHandler = async () => {

        try{
            const config = {
                withCredentials: true,
                headers: {
                "Content-Type": "application/json",
                }
            }
            const response = await axios.post(`${server}/api/v1/posts/create`, {
                title: title,
                description: description,
            }, config);

            if(response?.data?.success) {
                dispatch(setRefetchPostList(true));
            }

            setTitle("");
            setDescription("");
            toast.success(response?.data?.message);
        }
        catch(error) {
            toast.error(error?.response?.data?.message || "Something went wrong Hehe");
        }
    }


  return (
    <>
        {console.log('component rendered: createPost.jsx')}
      <Box
        height={"auto"}
        // width={"90%"}
        sx={{
            boxSizing: 'border-box',
            bgcolor: pinkWhite,

            alignSelf: "center",
            justifySelf: "center",

            marginLeft: "auto",
            marginRight: "auto",
            // marginTop: "5rem",


            width: {
                xs: "100%",
                sm: "100%",
                md: "90%",
                lg: "90%",
                xl: "80%",
            },

            border: "2px solid black",
        }}
      >

        <Stack
            direction={"column"}
            sx={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >

            <Typography 
                textAlign={"center"}
                sx={{
                    marginTop: "1rem",
                }}
            > {"C R E A T E"} </Typography>

            <textarea
                value={title}
                onChange={handleTitleChange}
                placeholder="Title"
                style={{
                    boxSizing: 'border-box',
                    width: "85%",
                    height: "2.5rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    padding: '10px',
                    borderRadius: '5px',
                    resize: 'none', // Disable resizing by the user

                    
                    overflow: "auto",
                    '&::-webkit-scrollbar': {
                        display: 'none',  // For Chrome, Safari, and Opera
                    },
                    scrollbarWidth: 'none',
                }}
            />

            <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Description"
                style={{
                    boxSizing: 'border-box',
                    width: "85%",
                    height: "5rem",
                    // marginTop: "1rem", 
                    marginBottom: "1rem",
                    padding: '10px',
                    borderRadius: '5px',
                    resize: 'none', // Disable resizing by the user

                    
                    overflow: "auto",
                    '&::-webkit-scrollbar': {
                        display: 'none',  // For Chrome, Safari, and Opera
                    },
                    scrollbarWidth: 'none',
                }}
            />

            <Button
                variant="outlined"
                disabled={Boolean(title.length === 0 || description.length === 0)}
                sx={{
                    width: "50%",
                    margin: '1rem',
                    // cursor: title.length === 0 && description.length === 0 ? "not-allowed" : "pointer",

                    '&.Mui-disabled': {
                        backgroundColor: 'grey',
                        color: 'rgba(255, 255, 255, 0.5)',
                        cursor: 'not-allowed',
                        pointerEvents: 'none',
                    },
                }}
                onClick={submitPostHandler}
            >
                Post
            </Button>

        </Stack>

      </Box>
    </>
  )
}

export default CreatePost;
