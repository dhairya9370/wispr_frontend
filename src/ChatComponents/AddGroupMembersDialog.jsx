import { Box, CircularProgress, Dialog, IconButton, Typography } from "@mui/material"
import Searchbar from "../Searchbar"
import SearchingChatBoxList from "./SearchingChatBoxList";
import { useEffect, useState } from "react";
import AddGroupMembersChatBoxList from "./AddGroupMembersChatBoxList";
import Slide from '@mui/material/Slide';
import separateUser from "../utils/separateUser";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from "../api";
import { useSnackbar } from "../SnackbarProvider";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
export default function AddGroupMembersDialog({ chatList, open, setOpen, userId }) {
    const [searchingList, setSearchingList] = useState([]);
    const [loadingSearchList, setLoadingSearchList] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [checkedList, setCheckedList] = useState([]);
    const [addingMembers,setAddingMembers]=useState(false);
    const {showSnackbar}=useSnackbar();
    const navigateTo=useNavigate();
    const onAddMembersHandler=async()=>{
        setAddingMembers(true);
        try{
            const result= await api.post("/api/create-group",{
                participants:checkedList,
                createdBy:userId,
            });
            // console.log(result.data);
            if(result.status===200){

                setOpen(false);
                const newChatId=result.data.group._id.toString();
                
                socket.emit("set-chat-overview-open",{chatId:newChatId,onNewGroup:true});
                socket.emit("notify-new-group-created",{chat:result.data.group});
                showSnackbar("success",result.data.message);
                navigateTo(`/${userId}/chats/${newChatId}`);
            }

        }catch(err){
            showSnackbar("error","Failed to Add Members");
            setAddingMembers(false);
        }
    }
    return (
        <Dialog
            slots={{ transition: Slide }}
            keepMounted
            slotProps={{
                backdrop: { sx: { backgroundColor: 'rgba(255, 255, 255, 0)' } },
                // paper: {
                //     sx: {
                //         position: 'absolute',
                //         m: 0,
                //     },
                // },
                transition: { direction: 'up' }
            }}
            sx={{
                display: { xs: "none", sm: "none", md: "flex" }, '& *': {
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
                },
            }}
            open={open} 
            onClose={() => {
                console.log("dialog closed");
                setOpen(false);
                setCheckedList([]);
            }}
        >
            <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{display:"flex",justifyContent:"space-between"}}>
                    <Typography sx={{ fontSize: 25, mt: 0.5, ml: 0.5 }}>Add Members</Typography>
                    <IconButton onClick={onAddMembersHandler} sx={{bgcolor:"#19bc55",color:"white",borderRadius:2,"&:hover":{color:"#19bc55",border:"1px solid grey"}}}><ArrowForwardIcon/></IconButton>
                </Box>
                <Searchbar userId={userId} value={searchValue} setValue={setSearchValue} setSearchingList={setSearchingList} setLoadingSearchList={setLoadingSearchList} />
                <Box sx={{ overflow: 'auto', width: 350, minHeight: 400 }}>
                    {searchValue?.trim() ?
                        <>
                            {loadingSearchList ?
                                <Box
                                    sx={{ width: "100%", height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                    <CircularProgress sx={{ color: '#25d366' }} />
                                </Box>
                                :
                                searchingList?.length ?
                                    <AddGroupMembersChatBoxList
                                        open={open}
                                        checkedList={checkedList}
                                        setCheckedList={setCheckedList}
                                        chatList={searchingList}
                                        userId={userId}
                                    />
                                    :
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: 400,
                                            backgroundImage: `url(${"https://res.cloudinary.com/dgmbfhpbw/image/upload/v1754377625/emptySearch_ozpz7n.png"})`,
                                            backgroundPosition: "center",
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "100%",
                                            backgroundColor: "rgba(194,226,179,255)"
                                        }}
                                    >
                                    </Box>
                            }
                        </>
                        :
                        <AddGroupMembersChatBoxList
                            open={open}
                            checkedList={checkedList}
                            setCheckedList={setCheckedList}
                            chatList={
                                chatList
                                    .filter((chat) => !chat?.isGroup)
                                    .map((chat) => separateUser(chat, userId)?.receiver)}
                            userId={userId}
                        />
                    }
                </Box>
            </Box>
        </Dialog>
    )
}
