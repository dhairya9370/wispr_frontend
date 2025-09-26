import { Box, CircularProgress } from "@mui/material";
import Searchbar from "../Searchbar";
import { useState } from "react";
import Heading from "../Heading";
import CallBoxList from "./CallBoxList";
import SearchingCallBoxList from "./SearchingCallBoxList";
import SearchingChatBoxList from "../ChatComponents/SearchingChatBoxList";

export default function CallsLeftPane({ userId, callId, userList }) {
    const [searchingList, setSearchingList] = useState(null); 
    const [loadingSearchList, setLoadingSearchList] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    overflow: 'none'
                }}
            >
                <Heading type={"Calls"} userId={userId} chatList={userList} />
                <Searchbar userId={userId} value={searchValue} setValue={setSearchValue} setSearchingList={setSearchingList} setLoadingSearchList={setLoadingSearchList} />
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {searchValue?.trim() ?
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
                    <CallBoxList
                        userList={userList}
                        userId={userId}
                    />
                }
            </Box>
        </Box>
    );
}
