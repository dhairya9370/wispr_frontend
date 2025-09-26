import socket from "../socket.js"; // adjust this as needed
import { v4 as uuidv4 } from "uuid";
import findLastMsg from "./findLastMsg.js";
import formatTime from "./formatTime.jsx";
import sortChatList from "./sortChatList.js";
import axios from "axios";
import formatDate from "./formatDate.jsx";
import api from "../api.js";
export default async function sendBtnHandler({
    file,
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
}) {
    const now = new Date().toISOString();
    const newMsgId = uuidv4();
    setChatList((curr) => {
        const updated = curr.map((chat) => {
            if (chat._id?.toString() === activeChat._id?.toString()) {
                const updatedChat = {
                    ...chat,
                    messages: [
                        ...chat.messages,
                        {
                            _id: "",
                            from: userId,
                            uuid: newMsgId,
                            content: msgValue.trim(),
                            sentTo: { chatId: activeChat._id, at: now },
                            sentAt: formatTime(now),
                            status: 0,
                            deliveredTo: [],
                            seenBy: [],
                            file: file ? {
                                type: file.type,
                                filename: file.name,
                                url: file.url,
                                size: file.file.size
                            } : null,
                        }
                    ]
                }
                return findLastMsg(updatedChat)
            } else {
                return chat
            }
        }
        );
        return sortChatList(updated,userId);
    });
    setMsgList((curr) => {
        const updated = curr;
        let lastDate = "";
        if (msgListRef.current.length) {
            for (let i = msgListRef.current.length - 1; i >= 0; i--) {
                if (msgListRef.current[i].type === "date") {
                    lastDate = msgListRef.current[i].date;
                    break;
                }
            }
        }
        if (lastDate !== "Today") {
            updated.push({ type: "date", date: "Today" });
        }
        updated.push({
            type: "sent",
            msg: {
                _id: "",
                uuid: newMsgId,
                file: file,
                content: msgValue.trim(),
                sentAt: formatTime(now),
                status: 0,
            },
        });
        msgListRef.current = updated;
        return updated;
    });

    // let lastDate = "";
    // if (msgList.length) {
    //     for (let i = msgList.length - 1; i >= 0; i--) {
    //         if (msgList[i].type === "date") {
    //             lastDate = msgList[i].date;
    //             break;
    //         }
    //     }
    // }
    // if (lastDate !== "Today") {
    //     setMsgList((curr) => {
    //         return [
    //             ...curr,
    //             { type: "date", date: "Today" },
    //             { type: "sent", msg: { _id: "", uuid: newMsgId, content: msgValue.trim(), sentAt: formatTime(now), status: 0 } }
    //         ]
    //     });
    // } else {
    //     setMsgList((curr) => {
    //         const newList = [...curr, { type: "sent", msg: { _id: "", uuid: newMsgId, content: msgValue.trim(), sentAt: formatTime(now), status: 0, deliveredTo: [], seenBy: [], files: [], from: userId, } }];
    //         console.log(newList);
    //         return newList
    //     });
    // }
    requestAnimationFrame(() => {
        if (msgsContainnerRef.current) {
            msgsContainnerRef.current.scrollTo({
                top: msgsContainnerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    });
    if (setMsgValue) { setMsgValue(""); }
    let newUrl = null;
    if (file) {
        const formData = new FormData();
        formData.append("file", file.file);

        try {
            const result = await api.post("/upload", formData);
            console.log("Uploaded:", result.data.url);
            setMsgList((curr) => {
                const updatedList = curr.map((msgObj) => {
                    if (msgObj.type === "sent" && msgObj.msg?.uuid === newMsgId) {
                        return { ...msgObj, msg: { ...msgObj.msg, file: { ...msgObj.msg.file, url: result.data?.url }, status: 1 } }
                    }
                    else { return msgObj }
                });
                msgListRef.current = updatedList;
                return updatedList;
            });
            requestAnimationFrame(() => {
                if (msgsContainnerRef.current) {
                    msgsContainnerRef.current.scrollTo({
                        top: msgsContainnerRef.current.scrollHeight,
                        behavior: "smooth"
                    });
                }
            });
            setChatList((curr) => {
                const updated = curr.map((chat) => {
                    if (chat._id?.toString() === activeChat._id?.toString()) {
                        const updatedChat = {
                            ...chat,
                            messages: chat.messages.map((msg) =>
                                msg.uuid === newMsgId ?
                                    { ...msg, file: result.data, status: 1 }
                                    : msg
                            )
                        }
                        return findLastMsg(updatedChat)
                    } else {
                        return chat
                    }
                }
                );
                return updated;
            });
            newUrl = result.data?.url;
            socket.emit("send-message", {
                uuid: newMsgId,
                from: userId,
                file: newUrl ? {
                    url: newUrl,
                    type: file.type,
                    filename: file.name,
                    size: file.file.size
                } : null,
                content: msgValue.trim(),
                sentTo: { chatId: chatId, at: now },
            });
        }
        catch (err) {
            console.log(err.response.data.message);
            setMsgList((curr) => {
                const updatedList = curr.map((msgObj) => {
                    if (msgObj.type === "sent" && msgObj.msg?.uuid === newMsgId) {
                        return { ...msgObj, msg: { ...msgObj.msg, status: -1 } }
                    } else { return msgObj }
                });
                msgListRef.current = updatedList;
                return updatedList
            });
            if (err.response.status === 401) {
                navigateTo("/login");
            }
        }

    } else {
        socket.emit("send-message", {
            uuid: newMsgId,
            from: userId,
            file: null,
            content: msgValue.trim(),
            sentTo: { chatId: chatId, at: now },
        });
    }
}
