
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { sampleMessages, sampleSelectedUser } from '../library/sampleData';
import { formatDate, formatDateMinutes } from '../library/functions';
import { MoreHoriz as MoreHorizIcon, Duo as DuoIcon, BlockRounded as BlockRoundedIcon, DeleteOutline as DeleteOutlineIcon, AttachFile as AttachFileIcon, Send as SendIcon, Image as ImageIcon, VideoLibrary as VideoLibraryIcon, InsertDriveFile as InsertDriveFileIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import { useGetMessagesQuery } from '../redux/api/api';
import MessageComponent from '../components/shared/MessageComponent';
import { useSocket } from '../socket';
import axios from 'axios';
import { server } from '../constants/config';
import FileMenuDialog from '../dialogs/FileMenuDialog';
import { setIsFileMenu } from '../redux/reducers/misc';
import ChatHeader from '../components/layout/ChatHeader';
import '../utils/style.css';

const ChatWindow = () => {

  const containerRef = useRef(null);
  const bottomRef = useRef(null)
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  

  // For Testing Socket Connection
  // const testData = "testing socket working - from frontend";
  // useEffect(() => {
    
  //   socket.emit('TEST', {id: user?._id, data: testData});

  //   socket.on('TEST_RESULT', (data) => {
  //     console.log("Tested Successfully", data)
  //   });

  // }, [socket, user, testData]);




  const messageContainerRef = useRef(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { selectedChat } = useSelector((state) => state.chat);
  const [selectedUser, setSelectedUser] = useState(null);


  const { isFileMenu } = useSelector((state) => state.misc);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);


  // const oldMessagesChunk = useGetMessagesQuery({ selectedChat, page });

  // const { data: oldMessages, setDate: setOldMessages } = useInfiniteScrollTop({
  //   containerRef,
  //   oldMessagesChunk.data?.totalMessages,
  //   page, 
  //   setPage,
  //   oldMessagesChunk.data?.message,
  // })



  const handleAttachFileOpen = (event) => {
    console.log('handleAttachFileOpen');

    setFileMenuAnchor(event.currentTarget);
    dispatch(setIsFileMenu(true));
  };
  
  const handleCloseFileMenu = () => {  
    console.log('handleCloseFileMenu')
    setFileMenuAnchor(null);
    dispatch(setIsFileMenu(false));
  }


  const handleMessageOnChange = (e) => {
    setMessage(e.target.value);

    
    // todo
    // change this to show the user typing
    // if(!IamTyping){
    //   socket.emit(START_TYPING, {members, chatId})
    //   setIamTyping(true);
    // }

    // if(typingTimeout.current) clearTimeout(typingTimeout.current);

    // typingTimeout.current = setTimeout(() => {
    //   socket.emit(STOP_TYPING, {members, chatId})
    //   setIamTyping(false);
    // }, [2000])

  }

  // revisit
  // useEffect(() => {
  //   if(bottomRef.current){
  //     bottomRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // }, [messages]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // test purpose delete is
    // performSocket();

    // console.log(message, user, selectedChat);

    if (!message.trim()) {
      setMessage("");
      return;
    }

    // emmiting message to server
    socket.emit("NEW_MESSAGE", { selectedChat, message });
    setMessage("");
  }


  // // todo => check this function 
  // const getMessages = useCallback(async (pg) => {

  //   try{
  //     console.log('SelectedChat: ', pg, page, selectedChat?._id);
  //     const response = await axios.get(`${server}/api/v1/user/messages/${selectedChat?._id}/${page}`, { withCredentials: true });

  //     console.log('getMessages', page, response?.data);
      
  //     setPage((prev) => prev + 1);
  //     setMessages((prevMessages) => [ ...prevMessages, ...response?.data?.message]);
  //     setTotalMessages(response?.data?.totalMessagesCount);
  //     setTotalPages(response?.data?.totalPages);
  //   }
  //   catch(error) {
  //     console.log(error?.response);
  //   }
  // }, [page, selectedChat]);
 
  const getMessages = async () => {
    try{  
      console.log('SelectedChat: ', page, selectedChat?._id);
      const response = await axios.get(`${server}/api/v1/user/messages/${selectedChat?._id}/${page}`, { withCredentials: true });

      console.log('getMessages', page, response?.data);
      
      setPage((prev) => prev + 1);
      setMessages((prevMessages) => [ ...prevMessages, ...response?.data?.message]);
      setTotalMessages(response?.data?.totalMessagesCount);
      setTotalPages(response?.data?.totalPages);
    }
    catch(error) {
      console.log(error?.response);
    }
  }



  // todo
  // REFETCH after new message sent/received
  const newMessageListener =  useCallback((data) => {
    console.log('newMessageListener: ', data);
    setMessages((prev) => [ data?.message,  ...prev]);
    
    if(bottomRef.current){
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }

  }, [selectedChat]);



  // // get the selected chat id user (from backend)
  // useEffect(() => {

  //   // todo: axios request to get user 
  //   setSelectedUser(selectedChat);
  //   console.log('selectedChat: ', selectedChat);

  // }, [selectedChat]);


  // get the first page of messages
  useEffect(() => {
    setSelectedUser(selectedChat);

    setMessages([]);
    setPage(1);
    setTotalMessages(0);
    setTotalPages(0);

    console.log('chatWindow page: selectedChat: ', page, selectedChat);

    // getMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat && page === 1) {
      console.log('Fetching messages for new selectedChat', page, selectedChat);
      getMessages();
    }
  }, [selectedChat, page]);

  // initial fetch
  // useEffect(() => {
  //   if(selectedChat) {
  //     getMessages();
  //   }
  // }, []);



  // todo => create neat function for setting messages and set scrollIntoView behaviour smooth
  useEffect(() => {
    console.log('NEW_MESSAGE listener');
    socket.on('NEW_MESSAGE', newMessageListener);
  }, [socket]);



  return (
    <Box
      height={"100%"}
      width={"100%"}
      sx={{
        // bgcolor: "green",
      background: 'linear-gradient(135deg, #BEADFA, #E4F1FF)',
      background: 'linear-gradient(115deg, #c0fdff, #90dbf4, #fbf8cc)',
        
        overflow: "auto",
        '&::-webkit-scrollbar': {
            display: 'none',  // For Chrome, Safari, and Opera
        },
        scrollbarWidth: 'none',
      }}
    >

      <Stack>
        
        {/* This is user info top bar */}
        <ChatHeader />


        {/* This is area to show all messages */}
        <Stack
          id="scrollableStack"
          ref={messageContainerRef}
          height={"calc(100vh - 13rem)"}
          direction={"column-reverse"}
          boxSizing={"border-box"}

          // className={'chatwindow-background'}
          sx={{
            padding: "1rem",
            spacing: "1rem",
            overflowX: "hidden",
            overflowY: "auto",
            // bgcolor: "yellow",
            // border: "2px solid black",

            overflow: "auto",
            '&::-webkit-scrollbar': {
                display: 'none',  // For Chrome, Safari, and Opera
            },
            scrollbarWidth: 'none',

            // background: 'linear-gradient(140deg, #edf6f9, #BEADFA)',
          }}
        >

          {/* smooth behaviour to thsi when i send messages, its on top because i am using coloumn-reverse */}
          <div ref={bottomRef} />

          {/* todo => Implement infinity scroll here */}
          <InfiniteScroll
                dataLength={ messages.length}   // this is current number of messages
                hasMore={ messages.length < totalMessages }
                next={getMessages}
                inverse={true}
                scrollableTarget="scrollableStack"
                
                style={{ display: 'flex', flexDirection: 'column-reverse' }}

                // TODO => change below and add some better components
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
            >

              {
                messages?.map((i) => {
                  return <MessageComponent key={i?._id} message={i} user={selectedUser} />
                })
              }

          </InfiniteScroll>
          

          {/* { userTyping && <TypingLoader /> } */}

        </Stack>



        {/* This is to show message input and message tools */}
        <form 
          style={{height: "4rem", width: "90%", position: "relative", alignSelf: "center"}} 
          onSubmit={handleFormSubmit}
        >
          <Stack
            direction={"row"}
            height={"4rem"}
            // padding={"1rem"}
            alignItems={"center"}
            position={"relative"}
          >
              {/* To show attach file icon to send files */}
              <IconButton
                sx={{
                  position: "absolute",
                  left: "1.5rem",
                }}
                onClick={handleAttachFileOpen}
              >
                <AttachFileIcon />
              </IconButton>
              
              
              {/* To Show the file menu anchor */}
              <FileMenuDialog fileMenuAnchor={fileMenuAnchor} selectedUser={selectedUser} />


              {/* Input box to send message */}
              <InputBox     
                placeholder="Enter Message Here..."
                value={message}
                onChange={handleMessageOnChange}
              />

              <IconButton
                type="submit"
                sx={{
                  position: "absolute",
                  right: "1rem",
                  marginLeft: "1rem",
                  padding: "0.5rem",
                  bgcolor: "black",
                  color: "white",
                  "&:hover": {
                    bgcolor: "error.dark"
                  },
                }}
              >
                  <SendIcon />
              </IconButton>

          </Stack>
        </form>

      </Stack>

    </Box>
  )
}

export default ChatWindow;
