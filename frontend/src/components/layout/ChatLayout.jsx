
import { Drawer, Grid, IconButton, Skeleton, SwipeableDrawer, Typography, useMediaQuery } from "@mui/material";
import { MenuRounded as MenuRoundedIcon } from '@mui/icons-material';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { sampleChatList } from "../../library/sampleData";
import ChatHome from "../../pages/ChatHome";
import ChatWindow from "../../pages/ChatWindow";
import { setIsChatDrawerOpen, setIsMobileScreen } from "../../redux/reducers/misc";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import axios from "axios";
import { server } from "../../constants/config";

const ChatLayout = () => {
    const params = useParams();
    const dispatch = useDispatch();

    const [allChats, setAllChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { isMobileScreen } = useSelector((state) => state.misc);
    const { selectedChat } = useSelector((state) => state.chat);

    const isLoading = false;

    
    useEffect(() => {
        getAllChats();
    }, []);

    const getAllChats = async () => {
        const response = await axios.get(`${server}/api/v1/user/friends`, { withCredentials: true });
        // console.log(response?.data?.chats);

        response?.data?.chats?.map((chat) => {
            const time1 = new Date();
            const time2 = new Date(chat?.users[0]?.lastActive);

            const timeDiff = Math.abs(time1.getTime() - time2.getTime()) / (1000 * 60);
            if(timeDiff <= 2) {
                setOnlineUsers((prev) =>  [...prev, chat?.users[0]?._id]);
            }
        })
        
        setAllChats(response?.data?.chats);
    }
    const { isChatDrawerOpen } = useSelector((state) => state.misc);
    const toggleDrawer = () => {
        console.log("toggle");
        dispatch(setIsChatDrawerOpen(!isChatDrawerOpen));
    }
    

    return (
        <>

            {
                isMobileScreen && (
                    <IconButton 
                        onClick={toggleDrawer}
                        sx={{
                            position: "absolute",
                            top: "0.5rem",
                            left: "1rem",
                            zIndex: 9999,
                            border: "2px solid black",
                        }}
                    >
                        <MenuRoundedIcon  />
                    </IconButton>
                )
            }
        
            {/* Header component (navbar) */}
            <Header />


            {
                isLoading ? (
                    <Skeleton />
                ) : (
                    
                    <SwipeableDrawer
                        anchor={"left"}
                        open={isChatDrawerOpen}
                        onOpen={toggleDrawer}
                        onClose={toggleDrawer}
                        direction={'left'}
                    >
                        {/* Show Chat List Here (mobile view) */}
                        <ChatList
                            w={"70vw"}
                            chats={allChats}
                            newMessageAlert={[]}
                            onlineUsers={onlineUsers}
                        />
                    </SwipeableDrawer>
                )
            }

            <Grid container height={"calc(99vh - 4rem)"}>
                {/* Showing All the Chat List */}
                <Grid
                    item
                    sm={4}
                    md={5}
                    lg={4}
                    xl={3}
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                            md: "block",
                            lg: "block",
                            xl: "block",
                        },
                        border: "2px solid #9e9e9e",
                    }}
                    height={"100%"}
                >
                    <ChatList
                        chats={allChats}
                        newMessageAlert={[]}
                        onlineUsers={onlineUsers}
                    />

                </Grid>

                {/* selectedChat is determined/ taken from redux store (todo) */}
                {/* it showed when the chat id selected ele it will show home component */}


                {/* Main Column (all messages) */}
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={7}
                    lg={8}
                    xl={9}
                    height={"100%"}
                    sx={{
                        // bgcolor: "yellow",
                    }}
                >
                    {
                        selectedChat ? (
                            <ChatWindow />
                        ) : (
                            <ChatHome />
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default ChatLayout;
