import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import findLastMsg from '../utils/findLastMsg';
import axios from 'axios';
import socket from '../socket';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../SnackbarProvider';
export default function MsgRightClickMenu({ userId, chat, menu, setMenu, msgObj, setChatList, setMsgList }) {
  const navigateTo = useNavigate()
  const handleClose = () => {
    setMenu(null);
  };
  const copyBtnHandler = () => {
    navigator.clipboard.writeText(msgObj.msg.content);
    handleClose();
  };
  const { showSnackbar } = useSnackbar();
  const handleDeleteMsg = async () => {
    handleClose();
    // console.log(msgObj);
    setChatList((curr) => {
      const updatedList = curr.map((currChat) => {
        if (currChat._id.toString() === chat._id.toString()) {
          const updatedChat = {
            ...currChat,
            messages: currChat.messages.map((obj) => {
              if (obj?._id.toString() === msgObj.msg?._id.toString()) {
                return { ...obj, deleted: true, file: null }
              } else {
                return obj
              }
            })
          };
          return findLastMsg(updatedChat);
        } else {
          return currChat;
        }
      });
      return updatedList;
    });
    setMsgList((curr) =>
      curr.map((obj) =>
        obj.msg?._id.toString() === msgObj.msg?._id.toString() ?
          { ...obj, msg: { ...obj.msg, deleted: true, file: null } } :
          obj
      )
    );
    try {
      const result = await api.post("/api/delete-message", { msg: msgObj.msg });
      // console.log(result.status);
      if (result.status===200) {
        // then settle the new group creation process, 
        // then move towards calls page
        const recipientIds=[...chat.participants]
        .filter((p) => 
          p._id.toString() !== userId.toString())
        .map((r) => r._id.toString());
        // console.log(recipientIds);
        
        socket.emit("delete-message", {
          senderId: userId,
          msg: msgObj.msg,
          chatId: chat._id.toString(),
          recipientIds,
        });
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        navigateTo("/login");
      }
      showSnackbar("error", err?.response?.data?.message || err.message);
    }
  }
  return (
    <Menu
      open={menu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        menu !== null
          ? { top: menu.mouseY, left: menu.mouseX }
          :
          undefined
      }
      sx={{ borderRadius: 2 }}
    >
      <MenuItem onClick={copyBtnHandler}><ContentCopyIcon sx={{ mr: 1 }} />Copy</MenuItem>
      <MenuItem onClick={handleClose}><ReplyIcon sx={{ mr: 1 }} />Reply</MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}><ShortcutIcon sx={{ mr: 1 }} />Forward</MenuItem>
      {/* <MenuItem onClick={handleClose}><DeleteIcon sx={{ mr: 1 }} />Delete for me</MenuItem> */}
      {msgObj.type === "sent" ?
        <MenuItem onClick={handleDeleteMsg}><DeleteIcon sx={{ mr: 1 }} />Delete for everyone</MenuItem> :
        null
      }
      <MenuItem onClick={handleClose}><CheckBoxOutlinedIcon sx={{ mr: 1 }} />Select</MenuItem>
      <MenuItem onClick={handleClose}><StarBorderOutlinedIcon sx={{ mr: 1 }} />Star</MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}><InfoOutlinedIcon sx={{ mr: 1 }} />info</MenuItem>
    </Menu>
  );
}
