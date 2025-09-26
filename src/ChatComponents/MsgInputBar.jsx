import { Box, InputBase, TextareaAutosize, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EmojiBtn from './EmojiBtn';
import SendIcon from '@mui/icons-material/Send';
import MicNoneIcon from '@mui/icons-material/MicNone';
import AttachFileBtn from './AttatchFileBtn';
import {useNavigate} from "react-router-dom";
import sendBtnHandler from '../utils/SendBtnHandler';
export default function MsgInputBar({ activePreview, setActivePreview, setSelectedFiles, setOpenFileInputBar, openFileInputBar, msgList, activeChat, chatList, setChatList, userId, chatId, setMsgList, msgsContainnerRef }) {
    const [msgValue, setMsgValue] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const emojiPopoverRef =useRef();
    const inputRef=useRef();
    const msgListRef = useRef(msgList);
    const navigateTo= useNavigate();
    const theme=useTheme();
    let onChangeHandler = (e) => {
        setMsgValue(e.target.value);
    }
    const callSendBtnHandler = () => {
        sendBtnHandler({
            file: null,
            msgValue,
            setMsgValue,
            setChatList,
            activeChat,
            userId,
            msgList,
            setMsgList,
            msgListRef,
            msgsContainnerRef,
            chatList,
            chatId,
            navigateTo
        });
    }
    useEffect(()=>{
        inputRef.current?.focus()
    },[]);
    
    return ( 
        <Box sx={{py:0.5, display: "flex", bottom: 0, flexDirection: "row", alignItems: "center", borderTop: `1px solid ${theme.palette.action.selected}`, justifyContent: "center" }}>
            <EmojiBtn 
                open={emojiPickerOpen}
                setOpen={setEmojiPickerOpen} 
                emojiPopoverRef={emojiPopoverRef}
                onSelectEmoji={(emoji) => { setMsgValue(msgValue + emoji); }} />
            <AttachFileBtn openFileInputBar={openFileInputBar}
                setOpenFileInputBar={setOpenFileInputBar}
                setSelectedFiles={setSelectedFiles}
                activePreview={activePreview}
                setActivePreview={setActivePreview}
            />
            <Box sx={{ width: "100%", mb: 1, ml: 2, mr: 1, p: 0 }}>
                <TextareaAutosize
                    ref={inputRef}
                    maxRows={6}
                    aria-label="maximum height"
                    onChange={onChangeHandler}
                    name='msgInput'
                    placeholder='Type a message'
                    value={msgValue}
                    required={true}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                        }
                        if (e.key === "Enter" && e.shiftKey) {
                            return;
                        }
                        if (e.key === "Enter" && msgValue.trim()) {
                            e.preventDefault();
                            callSendBtnHandler()
                        }
                    }}
                    style={{
                        color:theme.palette.text.primary,
                        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif', resize: 'none', outline: 'none', width: "100%", backgroundColor: theme.palette.background.paper, fontSize: "1.5rem", border: "none"
                        , textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        display: "block"
                    }}
                />
            </Box >
            <Box sx={{
                display: "flex"
                , p: 1, transition: 'background-color 0.2s ease',
                '&:hover': {
                    backgroundColor: theme.palette.action.hover
                },
                mr: 1, borderRadius: 1,
            }}>
                {msgValue ?
                    <SendIcon sx={{
                        width: "25px",
                        height: "25px",
                        color: 'rgb(54, 199, 41)',
                        cursor: 'pointer',
                        display: 'inline-block',

                    }}
                        onClick={callSendBtnHandler}
                    /> :
                    <MicNoneIcon sx={{
                        width: "25px",
                        height: "25px",
                        cursor: 'pointer',
                        display: 'inline-block',
                        color:theme.palette.text.primary,
                    }} />}
            </Box>
        </Box>
    );
}
