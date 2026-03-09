

import { Stack } from '@mui/material';
import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatItem from '../shared/ChatItem';
import { setLastMessage, setLastMessages, setChatList, setChatListVersion } from '../../redux/reducers/chat';


const ChatList = ({
    w="100%",
    chats,
    newMessagesAlert,
    onlineUsers,
}) => {

    
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { chatList, selectedChat, lastMessages, chatListVersion } = useSelector((state) => state.chat);

    const [sortedChats, setSortedChats] = useState([]);

    console.log('ChatList: ', { onlineUsers, selectedChat, chats, chatList });


    useEffect(() => {
      if (!chatList || Object.keys(chatList).length === 0) {
        setSortedChats([]);
        return;
      }

      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@")

      const chatArray = Object.values(chatList); // ✅ Convert object → array
      console.log(chatArray)

      const sorted = [...chatArray].sort((a, b) => {
        const aTime = new Date(a?.lastMessage?.createdAt || lastMessages?.[a._id]?.createdAt || a?.createdAt || 0).getTime();
    
        const bTime = new Date(b?.lastMessage?.createdAt || lastMessages?.[b._id]?.createdAt || b?.createdAt || 0).getTime();
    
        return bTime - aTime;
        
      });
    
      console.log('RAW_IDS:', chatArray.map(c => c._id));
      // console.log('SORTED_IDS:', sorted.map(c => c._id));
    
      setSortedChats(sorted);
    }, [dispatch, chatList]);
    

  return (
    <>
        <Stack
            width={w}
            height={"100%"}
            overflow={"auto"}
            direction={"column"}
            sx={{
                overflow: "hidden",
                // border: "2px solid black",
                background: 'linear-gradient(180deg, #C5FFF8, #96EFFF, #A0E9FF)',
                
                // background: 'linear-gradient(230deg, #c0fdff, #90dbf4, #fbf8cc)',
                // background: 'linear-gradient(180deg, #edf6f9, #BEADFA)',
                
                // background: 'linear-gradient(180deg, #1E0342, #070F2B)',

                // background: 'linear-gradient(210deg, #EEF5FF, #B4D4FF, #86B6F6, #38419D)',
                // background: 'linear-gradient(180deg, #EEF7FF, #050C9C)', 

            }}
        >
            {
              sortedChats?.map((data, index) => {

                    console.log("ChatList Mapped Item: ", data);

                    const {_id, lastActive, sender, receiver, createdAt} = data;
                    const otherUser = (sender?._id.toString() == user?._id.toString()) ? receiver : sender;
                    {/* console.log(otherUser, users[0]?._id.toString(),  user?._id.toString());
                    console.log(lastMessage, lastMessage?.sender?._id, lastMessage?.receiver?._id) */}

                    const newMessageAlert = newMessagesAlert?.find(
                        ({chatId}) => (chatId?.toString() === _id?.toString())
                    );
                    
                    const isOnline = onlineUsers?.includes(otherUser?._id);
                    console.log("__________________________________", onlineUsers, otherUser?. _id, isOnline);

                    return (
                        <ChatItem 
                            key={`${_id}-${createdAt}`}
                            // key={_id}
                            _id={otherUser?._id}
                            chatUser={otherUser}
                            username={otherUser?.username}
                            name={otherUser?.name}
                            avatar={otherUser?.avatar}
                            lastActive={lastActive}
                            senderId={sender?._id}
                            receiverId={receiver?._id}
                            isOnline={isOnline}
                            createdAt={createdAt}
                        />
                    )
                })
            }
        </Stack>
    </>
  )
}

export default ChatList;