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
import api from '../api.js';
import { useSnackbar } from '../SnackbarProvider.jsx';
import { CircularProgress } from '@mui/material';

export default function CallBox({userId,receiver}) {
    const navigateTo = useNavigate();
    const {showSnackbar}=useSnackbar();
    const navigateToChatHandler = async() => {
    
    //     try{
    //         const result = await api.post("/api/create-new-chat",{participants:[userId,receiver._id]});
    //         // console.log(result.data);
    //         const chatId=result.data.chat._id.toString();
    //         setSearchingList(null);
    //         setSearchValue("");
    //         // console.log(result.data.chat);
    //         navigateTo(`/${userId}/chats/${chatId}`);
    //     }catch(err){
    //         console.log(err);
    //         showSnackbar("error","Failed to find Chat")
    //     }
    }
    return (
        <ListItem sx={{borderRadius:2,overflow: "hidden"}} key={receiver._id} className='callBox' onClick={navigateToChatHandler} disablePadding>
            <ListItemButton >
                <ListItemAvatar sx={{ mr: 1 }}>
                    <Avatar alt={receiver.name} src={receiver.ui.dp} sx={{ width: 50, height: 50, bgcolor: RandomMuiColor() }} />
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
                            sx={{ fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif', fontWeight: 'bold', color: 'black', flex: 1, minWidth: 0, fontSize: 18 }}
                        >
                            {receiver.name}
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
                            sx={{
                                opacity: 0.7,
                                overflow: "auto",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0.5,
                                color: '#222222aa',
                                flex: 1, minWidth: 0,
                                fontSize: 16,
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif'
                            }}
                        >
                            {receiver.username}
                        </Box>
                    </Box>
                </Box>
                
            </ListItemButton>
        </ListItem>
    );
}
