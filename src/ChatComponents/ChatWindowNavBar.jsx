import React, { useEffect, useState, } from 'react';
import { useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RandomMuiColor from '../RandomMuiColor';
import formatDate from '../utils/formatDate';
import formatTime from '../utils/formatTime';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileDisplayWindow from "./FileDisplayWindow";
import { useTheme } from '@emotion/react';
export default function ChatWindowNavBar({ setOverviewOpen, msgList, online, receiver, userId }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [openedMedia, setOpenedMedia] = useState(null);
    const navigateTo = useNavigate();
    const [fileDisplayOpen, setFileDisplayOpen] = useState(false);
    const theme=useTheme();
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const findMedia = (msgList) => {
        const media = msgList?.reverse().find((msgObj) =>
            msgObj?.msg?.file?.type?.includes("image") || msgObj?.msg?.file?.type?.includes("video")
        );
        if (media?.msg?.file) {
            setOpenedMedia(media.msg.file);
            setFileDisplayOpen(true);
        }
        return media?.length ? media : null;
    };

    const settings = ['Search', 'Mute', 'Disappearing Messages'];
    return (
        <AppBar position="static" sx={{ width: '100%', backgroundColor:theme.palette.mode==="dark"?theme.palette.background.paper: '#075e54' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ArrowBackIcon onClick={() => navigateTo(`/${userId}/chats`)} sx={{ display: { xs: "block", sm: "block", md: "none" }, color: "white", ml: -1 }} />
                    <Tooltip title="Profile">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Menu Avatar" src={receiver.isGroup ? receiver.group.dp : receiver.ui.dp} sx={{ width: 36, height: 36, ml: -1, bgcolor: RandomMuiColor() }} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        sx={{ mt: '45px' }}
                    >
                        <MenuItem key={"Media"} onClick={(e) => { findMedia(msgList); handleCloseUserMenu() }}>
                            <Typography textAlign="center">{"Media"}</Typography>
                        </MenuItem>
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                <Typography textAlign="center">{setting}</Typography>
                            </MenuItem>
                        ))}
                        <MenuItem key={"Overview"} onClick={(e) => { setOverviewOpen(true); handleCloseUserMenu() }}>
                            <Typography textAlign="center">{"Overview"}</Typography>
                        </MenuItem>
                    </Menu>
                    <Box
                        sx={{
                            mt: 0.3,
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",       // ⬅️ prevent child text overflow
                            maxWidth: { xs: "55vw", sm: "60vw", md: "none" }, // ⬅️ responsive max width
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            noWrap
                            sx={{
                                fontSize: { xs: "1rem", sm: "1rem", md: 20 },
                                fontWeight: 500,
                                color: 'white',
                                lineHeight: 1.4,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {receiver.isGroup ? receiver.group.name : receiver.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{
                                mt: 0.2,
                                fontSize: { xs: 12, sm: 12, md: 15 },
                                color: "rgba(255,255,255,0.7)",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {receiver?.isGroup ?
                                online.count > 0 ?
                                    online.count + " online"
                                    :
                                    receiver.participants.map((p) => { return `${p.name},` })
                                : online.is ?
                                    'online'
                                    :
                                    `last seen on ${formatDate(online.last)} at ${formatTime(online.last)}`
                            }
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "none", md: "flex" }, alignItems: 'center', gap: 1 }}>

                    <Box sx={{ display: 'flex', backgroundColor: '#676b67aa', borderRadius: '8px', mr: 1 }}>
                        <Button onClick={() => { }} sx={{ color: 'white', minWidth: 0 }} title="Video Call">
                            <VideocamOutlinedIcon sx={{ fontSize: 35 }} />
                        </Button>
                        <Button onClick={() => { }} sx={{ color: 'white', minWidth: 0 }} title="Voice Call">
                            <CallOutlinedIcon sx={{ fontSize: 35 }} />
                        </Button>
                    </Box>

                    <Button onClick={() => { }} title="Search" sx={{ color: 'white', minWidth: 0 }}>
                        <SearchOutlinedIcon sx={{ fontSize: 30 }} />
                    </Button>
                </Box>
            </Toolbar>
            {fileDisplayOpen &&
                <FileDisplayWindow
                    setOpen={setFileDisplayOpen}
                    setOpenedFile={setOpenedMedia}
                    openedFile={openedMedia}
                    msgList={msgList}
                />}
        </AppBar>
    );
}

