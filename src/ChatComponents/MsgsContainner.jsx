import { Avatar, Box, List, ListItem, ListItemAvatar, ListSubheader } from "@mui/material";
import SentMsg from "./SentMsg";
import ReceivedMsg from "./ReceivedMsg";
import "./MsgsContainner.css"
import { useRef, useEffect, useState } from 'react';
import DateStamp from "./DateStamp";
import MsgRightClickMenu from "./MsgRightClickMenu";
import socket from "../socket";
import { v4 as uuid } from "uuid";
import RandomMuiColor from "../RandomMuiColor";
import api from "../api";
import { useSnackbar } from "../SnackbarProvider";
import { useNavigate } from "react-router-dom";

// it should redirect to the users individual chat's overview/chat
//handle file sending if issues
//handle delete message if issues
export default function MsgsContainner({ ref, msgList, userId, setMsgList, setChatList, activeChat, chatList }) {
    const [menu, setMenu] = useState(null);
    const {showSnackbar}= useSnackbar();
    const [selectedMsg, setSelectedMsg] = useState({ type: "", msg: { content: "", } });
    const handlemenu = (event) => {
        event.preventDefault();
        // console.log(event.target.closest(".message").querySelector(".text").textContent);
        if (!event.target.closest(".message")) {
            setMenu(null);
            return;
        }
        setMenu({
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
        });
    };
    const navigateTo=useNavigate();
    const findSenderObj = (senderId) => {
        const senderObj = chatList
            .find((chat) => chat._id.toString() === activeChat._id.toString())
            .participants.find((p) => p._id.toString() === senderId.toString())
        return senderObj;
    }
    const handleRedirectToUserOverview = async (senderId) => {
        const individualChat = chatList.find((c) =>
            !c.isGroup &&
            c.participants.length === 2 &&
            c.participants.some((p) => p._id.toString() === senderId.toString()) &&
            c.participants.some((p) => p._id.toString() === userId.toString())
        );
        if (individualChat) {
            try {
                const result = await api.post("/api/create-new-chat", 
                    { participants: [userId, senderId] });
                const chatId = result.data.chat._id.toString();
                socket.emit("set-chat-overview-open", {chatId,onNewGroup:false});
                navigateTo(`/${userId}/chats/${chatId}`);

            } catch (err) {
                console.log(err);
                showSnackbar("error", "Failed to find Chat")
            }
        }else{
            navigateTo(`/${userId}/chats/${individualChat?._id?.toString()}`);
            socket.emit("set-chat-overview-open", individualChat?._id?.toString());
        }
    }
    return (
        <>
            <List ref={ref} className="containner" sx={{ pr: 2, pt: 2, overflowY: 'visible' }} onContextMenu={handlemenu} style={{ cursor: 'context-menu' }}>
                {msgList.map((obj, idx) => (
                    obj.type === "sent" ? (
                        <SentMsg msgObj={obj} key={uuid()} setSelectedMsg={setSelectedMsg} msgList={msgList} />
                    ) :
                        obj.type === "received" ? (
                            <ListItem key={uuid()} sx={{ display: "flex", pl: activeChat?.isGroup ? 1 : 2 }}>
                                {activeChat?.isGroup &&
                                    <Avatar
                                        alt={findSenderObj(obj?.msg?.from)?.name}
                                        src={findSenderObj(obj?.msg?.from)?.ui?.dp}
                                        sx={{ mr: 1, alignSelf: "flex-start", width: 30, height: 30, bgcolor: findSenderObj(obj?.msg?.from)?.ui?.background }}
                                        onClick={()=>{handleRedirectToUserOverview(obj?.msg?.from.toString())}}
                                    />
                                }
                                <ReceivedMsg sender={findSenderObj(obj?.msg?.from)} isGroup={activeChat?.isGroup} msgObj={obj} setSelectedMsg={setSelectedMsg} msgList={msgList} />
                            </ListItem>) :
                            obj.type === "date" ? (
                                <DateStamp date={obj.date} key={uuid()} />
                            ) : <></>
                ))}
                <MsgRightClickMenu userId={userId} chat={activeChat} setMsgList={setMsgList} setChatList={setChatList} key={uuid()} menu={menu} setMenu={setMenu} msgObj={selectedMsg} />
            </List>
        </>
    );
}
