import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ClearAllOutlinedIcon from '@mui/icons-material/ClearAllOutlined';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import MarkChatReadOutlinedIcon from '@mui/icons-material/MarkChatReadOutlined';
import api from '../api';
import { useSnackbar } from '../SnackbarProvider';
import separateUser from '../utils/separateUser';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import socket from '../socket';
export default function ChatBoxRightClickMenu({ userId, menu, setMenu, chat, setActiveChat }) {
  const handleClose = () => {
    setMenu(null);
  };
  const deleteBtnHandler = () => {
    // setActiveChat(null);
    handleClose();

  }
  const [pinned, setPinned] = React.useState(false);
  const { showSnackbar } = useSnackbar();
  React.useEffect(() => {
    if (chat && userId) {
      const { user } = separateUser(chat, userId);
      // console.log(user);
      if (user?.ui?.pinned?.includes(chat._id.toString())) {
        setPinned(true);
      } else { setPinned(false); }
    }
  }, [chat,userId]);

  const setPinnedHandler = async (e) => {
    try {
      const result = await api.post("/api/set-pinned-chats", { userId, chatId: chat._id });
      // console.log(result.data);
      handleClose();
      socket.emit("pin-unpin-chat");
      showSnackbar("success", "Pinned Chat to Top");
    } catch (err) {
      console.log(err);
      showSnackbar("error", "Failed to Pin Chat");
    }
  };
  
  const setUnpinHandler = async (e) => {
    try {
      const result = await api.post("/api/set-chat-unpinned", { userId, chatId: chat._id });
      // console.log(result.data);
      handleClose();
      socket.emit("pin-unpin-chat");
      showSnackbar("success", "Unpinned Chat");
    } catch (err) {
      console.log(err);
      showSnackbar("error", "Failed to Pin Chat");
    }
  };
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
      <MenuItem onClick={handleClose}><MarkUnreadChatAltOutlinedIcon sx={{ mr: 2 }} />Mark as read/unread</MenuItem>
      {pinned ?
        <MenuItem onClick={setUnpinHandler}><PersonOffIcon sx={{ mr: 2 }} />Unpin</MenuItem>
        :
        <MenuItem onClick={setPinnedHandler}><PushPinOutlinedIcon sx={{ mr: 2 }} />Pin to top</MenuItem>
      }
      <Divider />
      <MenuItem onClick={handleClose}><ClearAllOutlinedIcon sx={{ mr: 2 }} />Clear messages</MenuItem>
      <MenuItem onClick={deleteBtnHandler}><DeleteIcon sx={{ mr: 2 }} />Delete</MenuItem>
    </Menu>
  );
}
