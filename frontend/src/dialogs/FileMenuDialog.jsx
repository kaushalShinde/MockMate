

import { IconButton, Menu, MenuItem, Typography, MenuList } from '@mui/material';
import { Image as ImageIcon, VideoLibrary as VideoLibraryIcon, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsFileMenu, setIsUploadingLoader } from "../redux/reducers/misc";
import { toast } from "react-hot-toast";
import axios from 'axios';
import { server } from '../constants/config';

const FileMenuDialog = ({ fileMenuAnchor, selectedUser }) => {
    console.log('redered component: FileMenuDialog');

    const dispatch = useDispatch();

    const { isFileMenu } = useSelector((state) => state.misc);
    const handleCloseFileMenu = () => dispatch(setIsFileMenu(false));
    
    const imageRef = useRef(null);
    const videoRef = useRef(null);
    const fileRef = useRef(null);
        
    const selectImage = () => imageRef.current?.click();
    const selectVideo = () => videoRef.current?.click();
    const selectFile = () => fileRef.current?.click();

    const fileChangeHandler = async (e, fileType) => {

        const files = Array.from(e.target.files);
        console.log(files);

        if(files.length <= 0)   return;
        if(files.length > 5)    return toast.error(`You can send only 5 ${fileType} at a time`);

        dispatch(setIsUploadingLoader(true));

        const toastId = toast.loading(`Sending ${fileType}..`);
        handleCloseFileMenu();

        try {

            const formData = new FormData();
            formData.append("selectedUser", selectedUser?._id);
            files.forEach((file) => {
                formData.append('files', file)
            });

            // todo
            // request to send attachments
        
            const config = {
                withCredentials: true,
                headers: {
                    "Content-Type" : "multipart/form-data",
                },
            };
            const response = await axios.post(`${server}/api/v1/user/attachments`, formData, config);

            if(response?.data)   toast.success(`${fileType} send Successfully`, { id: toastId });
            else toast.error(`Failed to send ${fileType}`, { id: toastId });

        }
        catch (error) {
            toast.error(error?.response, {id: toastId});
        }
        finally {
            dispatch(setIsUploadingLoader(false));
        }
    }

    return (
        <Menu
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            anchorEl={fileMenuAnchor}
            open={isFileMenu}
            onClose={handleCloseFileMenu}
          >
            <div
                style={{
                    width: "10rem",
                }}
            >
                <MenuList>

                    <MenuItem onClick={selectImage}>
                        <IconButton>
                            <ImageIcon />
                        </IconButton>
                        <Typography sx={{marginLeft: "0.5rem"}} > Image </Typography>
                        <input 
                            ref={imageRef}
                            type="file"
                            multiple
                            accept='image/png, image/jpeg, image/gif'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Images")}
                        />
                    </MenuItem>

                    <MenuItem onClick={selectVideo}>
                        <IconButton>
                            <VideoLibraryIcon />
                        </IconButton>
                        <Typography sx={{marginLeft: "0.5rem"}} > Video </Typography>
                        <input 
                            ref={videoRef}
                            type="file"
                            multiple
                            accept='video/mp4, video/webm, video/ogg'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Videos")}
                        />
                    </MenuItem>

                    <MenuItem onClick={selectFile}>
                        <IconButton>
                            <InsertDriveFileIcon />
                        </IconButton>
                        <Typography sx={{marginLeft: "0.5rem"}} > File </Typography>
                        <input 
                            ref={fileRef}
                            type="file"
                            multiple
                            accept='*'
                            style={{ display: "none" }}
                            onChange={(e) => fileChangeHandler(e, "Files")}
                        />
                    </MenuItem>
            
                </MenuList>
            </div>
        </Menu>
    )
}

export default FileMenuDialog;
