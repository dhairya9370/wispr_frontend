import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../SnackbarProvider";
import { useState } from "react";
import api from "../api";
import { Avatar, Box, Chip, CircularProgress, extendTheme, ListItem, ListItemAvatar, ListItemButton, Typography, useTheme } from "@mui/material";
import RandomMuiColor from "../RandomMuiColor";
export default function OverviewChatBox({ userId, receiver}) {
    const navigateTo = useNavigate();
    const theme=useTheme();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const navigateToChatHandler = async () => {
        if(receiver._id===userId){return};
        setLoading(true);
        if (receiver?.isGroup) {
           navigateTo(`/${userId}/chats/${receiver._id}`); 
        } else {
            try {
                const result = await api.post("/api/create-new-chat", { participants: [userId, receiver._id] });
                const chatId = result.data.chat._id.toString();
                navigateTo(`/${userId}/chats/${chatId}`);
            } catch (err) {
                console.log(err);
                showSnackbar("error", "Failed to find Chat")
            }
        }
        setLoading(false);
    }
    return (
        <ListItem sx={{ borderRadius: 2, overflow: "hidden"}} key={receiver._id} className='chatBox' onClick={navigateToChatHandler} disablePadding>
            <ListItemButton >
                <ListItemAvatar sx={{ mr: 1 }}>
                    <Avatar alt={receiver?.isGroup ? receiver.group.name : receiver.name} src={receiver?.isGroup ? receiver?.group?.dp : receiver?.ui?.dp} sx={{ width: 50, height: 50, bgcolor: RandomMuiColor() }} />
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
                            {receiver?.isGroup ? receiver.group.name : receiver._id===userId? "You" :receiver.name}
                        </Typography>
                        {receiver?.isAdmin && 
                        <Box>
                            <Chip variant="outlined" label="Admin" sx={{fontWeight:700,color:"#57ba52ff",bgcolor:theme.palette.mode==="dark"?"transparent":"#effceeff",border:"solid #55bb4fff 1px"}}></Chip>
                        </Box>
                        }
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
                                color:theme.palette.text.secondary,
                                flex: 1, minWidth: 0,
                                fontSize: 16,
                                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif'
                            }}
                        >
                            {receiver?.isGroup ? `${receiver.participants.length} members` : receiver.username}
                        </Box>
                    </Box>
                </Box>
                {loading &&
                    <Box>
                        <CircularProgress sx={{ color: '#25d366' }} />
                    </Box>}
            </ListItemButton>
        </ListItem>
    );
}