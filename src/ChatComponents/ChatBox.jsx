import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import RandomMuiColor from '../RandomMuiColor';
import separateUser from '../utils/separateUser';
// import findLastMsg from '../utils/findLastMsg';
import unseenMsgs from '../utils/unseenMsgs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import socket from '../socket';
import renderLastMsg from '../utils/renderLastMsg.jsx';
import formatTime from '../utils/formatTime.jsx';
import formatDate from '../utils/formatDate.jsx';
import PushPinIcon from '@mui/icons-material/PushPin';
//now check message-delivered working and received-message working, integrate with updated unseen messages function
export default function ChatBox({onContextMenuHandler,pinned, chatList, setChatList, chat, userId, msgList, activeChat, setActiveChat }) {
  const states = ["pending", "sent", "delivered", "seen"];
  const { user, receiver } = separateUser(chat, userId);
  const navigateTo = useNavigate();
    const theme = useTheme();
  const navigateToChatHandler = () => {
    navigateTo(`/${userId}/chats/${chat._id}`);
  }
  return (
    <ListItem 
    onContextMenu={(e)=>{onContextMenuHandler(e,chat,userId)}}
    key={chat._id} className='chatBox' 
    onClick={navigateToChatHandler} 
    disablePadding
    sx={{
      bgcolor:
          activeChat?._id.toString() === chat._id.toString()
            ? theme.palette.action.selected
            : theme.palette.background.paper,
      color: theme.palette.text.primary,
      borderRadius:2,
      overflow: "hidden",
        "&:hover": {
          bgcolor: theme.palette.action.hover,
        },
    }}
    >
      <ListItemButton >
        <ListItemAvatar sx={{ mr: 1 }}>
          {receiver?.isGroup ?
          <Avatar alt={receiver.group?.name} src={receiver.group?.dp} sx={{ width: 50, height: 50, bgcolor: RandomMuiColor() }} />
          :
          <Avatar alt={receiver?.name} src={receiver?.ui?.dp} sx={{ width: 50, height: 50, bgcolor: RandomMuiColor() }} />
          }
        </ListItemAvatar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',

            }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              sx={{ fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif', fontWeight: 'bold', color: theme.palette.text.primary, flex: 1, minWidth: 0, fontSize: 18 }}
            >
              {receiver?.isGroup ? receiver?.group?.name: receiver?.name }
            </Typography>
            <Typography variant="caption"
              sx={{
                color: chat.unseen === 0 ? theme.palette.text.primary : '#56c750',
                fontWeight: chat.unseen === 0 ? 400 : 600,
                fontSize: 14,
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif'
              }}>
              {renderLastMsg(chat.lastMsg, userId, receiver).at}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0.5,
            }}
          >
            <Box
              sx={{"&::-webkit-scrollbar": {display: "none",}, overflow: "auto", display: "flex", flexDirection: "row", alignItems: "center", gap: 0.5, color: theme.palette.text.primary, flex: 1, minWidth: 0, fontSize: 16, fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif' }}
            >
              {renderLastMsg(chat.lastMsg, userId, receiver).content}
            </Box>
            <Badge
              badgeContent={chat.unseen}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: "#56c750",
                  color: "white",
                  minWidth: 20,
                  height: 20,
                  borderRadius: '50%',
                  fontSize: '0.75rem',
                  mr: 1,
                },
              }}
            />
            {pinned &&
              <PushPinIcon sx={{color:theme.palette.text.primary,transform:"rotateZ(45deg)"}}/>
            }
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
