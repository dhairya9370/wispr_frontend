import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ChatBox from './ChatBox';
import ChatBoxRightClickMenu from './ChatBoxRightClickMenu';
import { useEffect } from 'react';
import socket from '../socket';
import separateUser from '../utils/separateUser';

export default function ChatBoxList({ setChatList, chatList, userId, activeChat, msgList, setActiveChat }) {
  const [menu, setMenu] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [err, setError] = useState("All Fine");
  const handlemenu = (event,chat,userId) => {
    event.preventDefault();
    setMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
    setSelectedChat(chat);
    // console.log(chat,userId);
      
  };
  const isPinned=(chat,userId)=>{
    if(separateUser(chat,userId)?.user?.ui?.pinned?.includes(chat._id.toString())){
      return true;
    }else{
      return false;
    }
  }
  return (
    <List sx={{
      overflowY: 'visible', p: 0.5,
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    }}>
      {chatList.map((chat) => (
        <ChatBox
          onContextMenuHandler={handlemenu}
          key={chat._id}
          setChatList={setChatList}
          chatList={chatList}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          msgList={msgList}
          chat={chat}
          userId={userId}
          pinned={isPinned(chat,userId)}
        />
      ))}
      <ChatBoxRightClickMenu
        menu={menu}
        setMenu={setMenu}
        chat={selectedChat}
        userId={userId}
        setActiveChat={setActiveChat}
      />
    </List>
  );
}
