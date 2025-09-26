import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import AddGroupMembersChatBox from './AddGroupMembersChatBox';
import separateUser from '../utils/separateUser';

export default function AddGroupMembersChatBoxList({open,setCheckedList,checkedList ,userId, chatList }) {
    //   const [selectedChat, setSelectedChat] = useState(activeChat);
    //   const [err, setError] = useState("All Fine");
    useEffect(()=>{ if(!open){setCheckedList([]);}},[open]);
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
                    .map(user => (
                        <AddGroupMembersChatBox
                            open={open}
                            key={user._id}
                            receiver={user}
                            checkedList={checkedList}
                            setCheckedList={setCheckedList}
                        />
                    ))
                }
            </Box>
        </List>
    );
}
