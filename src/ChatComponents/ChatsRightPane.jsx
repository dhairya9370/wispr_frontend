import { Box, CircularProgress, List } from "@mui/material";
import ChatWindowNavBar from "./ChatWindowNavBar";
import MsgInputBar from "./MsgInputBar";
import MsgsContainner from "./MsgsContainner";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import formatTime from "../utils/formatTime";
import FileInputBar from "./FileInputBar";
import separateUser from "../utils/separateUser";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../SnackbarProvider";
import ChatOverview from "./ChatOverview";

export default function ChatsRightPane({ loadingMsgs, activeChat, chatList, setChatList, userId, msgList, setMsgList }) {
    // console.log("received at ChatRightPane",activeChat);
    const msgsContainnerRef = useRef();
    useEffect(() => {
        let cont = document.getElementById("msgsContainner");
        cont?.scrollTo({ top: cont.scrollHeight });
    }, [msgList]);
    const [openFileInputBar, setOpenFileInputBar] = useState(false);
    const [online, setOnline] = useState({ is: false, last: "", count: 0 });
    const onlineRef = useRef(online);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [activePreview, setActivePreview] = useState(selectedFiles ? selectedFiles[0] : { caption: "", name: "", uuid: "", url: "", type: "" });
    const { user, receiver } = separateUser(activeChat, userId);
    const { showSnackbar } = useSnackbar();
    const navigateTo = useNavigate();

    const [overviewOpen, setOverviewOpen] = useState(false);
    useEffect(() => {
        async function fetchUserStatus(receiver) {
            try {
                const res = await api.post("/api/user-status", {
                    recipientId: receiver._id.toString(),
                });
                onlineRef.current = { ...res.data.online, count: online.is ? 1 : 0 };
                setOnline(onlineRef.current);
            } catch (err) {
                console.error("Error fetching user status:", err);
                if (err?.response?.status === 401) {
                    navigateTo("/login");
                }
                showSnackbar("error", err?.response?.data?.message || err.message);
            }
        }
        async function fetchOnlineUsers(receiver) {
            try {
                const res = await api.post("/api/online-participants", {
                    recipients:
                        receiver.participants
                            .filter((p) => p._id.toString() !== userId.toString())
                            .map((r) => r._id.toString()),
                });
                setOnline((curr) => {
                    onlineRef.current = { ...curr, count: res.data.length };
                    return onlineRef.current;
                });
            } catch (err) {
                console.error("Error fetching user status:", err);
                if (err?.response?.status === 401) {
                    navigateTo("/login");
                }
                showSnackbar("error", err?.response?.data?.message || err.message);
            }
        }
        receiver.isGroup ? fetchOnlineUsers(receiver) : fetchUserStatus(receiver);

        const handleOnline = ({ userId }) => {
            if (receiver?.isGroup) {
                setOnline((curr) => {
                    onlineRef.current = { is: true, last: curr.last, count: curr.count + 1 }
                    return onlineRef.current;
                });
            } else {
                if (userId === receiver._id) {
                    setOnline((curr) => {
                        onlineRef.current = { ...curr, is: true };
                        return onlineRef.current;
                    });
                }
            }
        };
        const handleOffline = ({ userId, last }) => {
            if (receiver?.isGroup) {
                setOnline((curr) => {
                    onlineRef.current = { is: false, last: last, count: curr.count - 1 };
                    return onlineRef.current;
                });
            } else {
                if (userId === receiver._id) {
                    setOnline((curr) => {
                        onlineRef.current = { ...curr, is: false, last: last };
                        return onlineRef.current;
                    });
                }
            }
        };
        const handleOpenOverview = ({ chatId, onNewGroup }) => {
            if (onNewGroup) {
                showSnackbar("info", "Add Group details");
            }
            setOverviewOpen(true);
        }
        socket.on("user-online", handleOnline);
        socket.on("user-offline", handleOffline);
        socket.on("open-chat-overview", handleOpenOverview);
        return () => {
            socket.off("user-online", handleOnline);
            socket.off("user-offline", handleOffline);
            socket.off("open-chat-overview", handleOpenOverview);
        };
    }, [activeChat]);
    // useEffect(()=>{
    //     setOverviewOpen(false);
    // },[ location.pathname.split("/")[3]]);
    const hasAccess = (userId, receiver) => {
        if (!userId?.trim() || !activeChat) { return false }
        if (receiver?.isGroup) {
            return receiver?.group?.admins?.some(admin =>
                admin?.toString() === userId.toString()
            );
        } else {
            return false
        }
    }
    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', }}>

            {loadingMsgs ?
                <Box
                    sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                    <CircularProgress sx={{ color: '#25d366' }} />
                </Box>
                :
                <>
                    <Box sx={{ overflow: 'none' }}>
                        <ChatWindowNavBar setOverviewOpen={setOverviewOpen} msgList={msgList} online={online} receiver={receiver} userId={userId} />
                    </Box>

                    {overviewOpen ?
                        <ChatOverview chatList={chatList} msgList={msgList} setOverviewOpen={setOverviewOpen} userId={userId} access={hasAccess(userId, activeChat)} chat={activeChat} />
                        :
                        <>
                            <Box id="msgsContainner" sx={{ flex: 1, overflow: 'auto', backgroundImage: `url(${user.ui.wallpaper})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }} >

                                <MsgsContainner ref={msgsContainnerRef} userId={userId} msgList={msgList} setChatList={setChatList} activeChat={activeChat} setMsgList={setMsgList} chatList={chatList} />

                            </Box>
                            <Box sx={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
                                <FileInputBar
                                    open={openFileInputBar}
                                    setOpen={setOpenFileInputBar}
                                    activeChat={activeChat}
                                    msgList={msgList}
                                    chatList={chatList}
                                    setChatList={setChatList}
                                    chatId={activeChat._id}
                                    userId={userId}
                                    setMsgList={setMsgList}
                                    msgsContainnerRef={msgsContainnerRef}
                                    setSelectedFiles={setSelectedFiles}
                                    selectedFiles={selectedFiles}
                                    activePreview={activePreview}
                                    setActivePreview={setActivePreview}
                                />
                                <MsgInputBar
                                    activeChat={activeChat}
                                    msgList={msgList}
                                    chatList={chatList}
                                    setChatList={setChatList}
                                    chatId={activeChat._id}
                                    userId={userId}
                                    setMsgList={setMsgList}
                                    openFileInputBar={openFileInputBar}
                                    setOpenFileInputBar={setOpenFileInputBar}
                                    msgsContainnerRef={msgsContainnerRef}
                                    setSelectedFiles={setSelectedFiles}
                                    activePreview={activePreview}
                                    setActivePreview={setActivePreview}
                                />
                            </Box>
                        </>
                    }</>
            }
        </Box>
    );
}
