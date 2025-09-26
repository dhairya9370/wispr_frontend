import React, { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ChatBox from './ChatBox';
import { useEffect } from 'react';
import socket from '../socket';
import SearchingChatBox from './SearchingChatBox';

export default function SearchingChatBoxList({ setSearchValue, userId, setSearchingList, chatList }) {
    //   const [selectedChat, setSelectedChat] = useState(activeChat);
    //   const [err, setError] = useState("All Fine");
    return (
        <List
            sx={{
                overflowY: 'visible',
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
            }}>
            <Box>
                {chatList
                    .filter(user => user._id.toString() !== userId.toString())
                    .map(user => (
                        <SearchingChatBox
                            key={user._id}
                            receiver={user}
                            userId={userId}
                            setSearchValue={setSearchValue}
                            setSearchingList={setSearchingList}
                        />
                    ))
                }
            </Box>
        </List>
    );
}
