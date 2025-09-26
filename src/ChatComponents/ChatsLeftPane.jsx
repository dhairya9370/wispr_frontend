import Heading from "../Heading";
import ChatBoxList from "./ChatBoxList";
import Searchbar from "../Searchbar";
import "./ChatsLeftPane.css";
import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import api from "../api";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import SearchingChatBoxList from "./SearchingChatBoxList";
export default function ChatsLeftPane({ setChatList, chatList, msgList, userId, activeChat, setActiveChat }) {
    const [searchingList, setSearchingList] = useState(null);
    const [loadingSearchList, setLoadingSearchList] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    // position: "sticky",
                    // top: 0,
                    // bgcolor: "#fff",
                    // zIndex: 2,
                    overflow: 'none'
                }}
            >
                <Heading type={"Chats"} userId={userId} chatList={chatList} />
                <Searchbar userId={userId} value={searchValue} setValue={setSearchValue} setSearchingList={setSearchingList} setLoadingSearchList={setLoadingSearchList} />
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {
                    searchValue?.trim() ?
                        <>
                            {loadingSearchList ?
                                <Box
                                    sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                                >
                                    <CircularProgress sx={{ color: '#25d366' }} />
                                </Box>
                                :
                                searchingList?.length ?
                                    <SearchingChatBoxList
                                        setSearchingList={setSearchingList}
                                        chatList={searchingList}
                                        setSearchValue={setSearchValue}
                                        userId={userId}
                                    />
                                    :
                                    <Box
                                        sx={{
                                            width: "100%",
                                            height: "100%",
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
                        <ChatBoxList
                            chatList={chatList}
                            msgList={msgList}
                            setChatList={setChatList}
                            userId={userId}
                            activeChat={activeChat}
                            setActiveChat={setActiveChat}
                        />
                }
            </Box>
        </Box>
    );
}
