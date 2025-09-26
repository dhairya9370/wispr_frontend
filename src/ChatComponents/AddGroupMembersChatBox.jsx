import React, { useEffect, useRef, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import RandomMuiColor from '../RandomMuiColor.jsx';
import { Checkbox, CircularProgress } from '@mui/material';

export default function AddGroupMembersChatBox({open,setCheckedList, receiver, checkedList }) {
    // console.log(checked);
    const [checked,setChecked]=useState(checkedList?.includes(receiver?._id.toString()));
    const checkedRef = useRef(checkedList);
    useEffect(()=>{ if(!open){setChecked(false);}},[open]);
    
    const handleToggle = (receiverId) => {
        const currentIndex = checkedRef.current?.indexOf(receiverId);

        let newChecked = checkedRef.current;

        if (currentIndex === -1) {
            newChecked.push(receiverId);
            setChecked(true);
        } else {
            newChecked.splice(currentIndex, 1);
            setChecked(false);
        }
        checkedRef.current = newChecked;
        console.log(checkedRef.current);
        setCheckedList(checkedRef.current);
    };
    return (
        <ListItem
            sx={{ borderRadius: 2, overflow: "hidden" }}
            key={receiver._id}
            className='chatBox'
            disablePadding
        >
            <ListItemButton >
                <ListItemAvatar sx={{ mr: 1 }}>
                    <Avatar alt={receiver?.name} src={receiver?.ui?.dp} sx={{ width: 50, height: 50, bgcolor: RandomMuiColor() }} />
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
                <Checkbox
                    edge="end"
                    onChange={() => handleToggle(receiver?._id.toString())}
                    checked={checked}
                    slotProps={{ input: { 'aria-labelledby': receiver?._id } }}
                />
            </ListItemButton>
        </ListItem>
    );
}
