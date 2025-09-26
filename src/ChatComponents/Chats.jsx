import { useEffect, useRef, useState } from "react";
import Heading from "../Heading";
import "./Chats.css"
import ChatsLeftPane from "./ChatsLeftPane";
import ChatsRightPane from "./ChatsRightPane";
import EmptyRightPane from "./EmptyRightPane";
import ResizableSplit from "../ResizableSplit"
import sortMsgs from "../utils/sortMsgs";
import socket from "../socket";
import formatTime from "../utils/formatTime";
import { v4 as uuidv4 } from "uuid";
import sortChats from "../utils/sortChats";
import axios from "axios";
import findLastMsg from "../utils/findLastMsg";
import unseenMsgs from "../utils/unseenMsgs";
import sortChatList from "../utils/sortChatList";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { useSnackbar } from "../SnackbarProvider";

export default function Chats({ userId, chatId }) {
  const [loadingMsgs,setLoadingMsgs]=useState(false);
  const [chatList, setChatList] = useState([]);
  const chatListRef = useRef(chatList);
  const [activeChat, setActiveChat] = useState(null);
  const activeChatRef = useRef(activeChat);
  const [msgList, setMsgList] = useState([]);
  const msgListRef = useRef(msgList);


  const navigateTo = useNavigate();
  const { showSnackbar } = useSnackbar();
  // console.log(msgList);
  async function fetchChats() {
    try {
      const response = await api.post('/api/get-all-chats', { userId })
      const { chatList } = response.data;
      setChatList((curr) => {
        const updated = sortChats(chatList, userId);
        chatListRef.current = updated
        return updated;
      });
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        navigateTo("/login");
      }
      showSnackbar("error", err?.response?.data?.message || err.message);
    }
  };
  async function fetchActiveChat() {
    if (chatId && chatId !== "") {
      try {
        setLoadingMsgs(true);
        const response = await api.post('/api/get-active-chat', { chatId });
        const activeChatData = response.data.activeChat;
        // console.log(activeChatData);
        setLoadingMsgs(false);
        setChatList((curr) => {
          const updatedList = curr?.map((chat) => {
            if (chat?._id.toString() === activeChatData._id.toString()) {
              return { ...findLastMsg(activeChatData), unseen: 0 };
            } else {
              return chat;
            }
          });
          // console.log(updatedList);

          chatListRef.current = updatedList
          return chatListRef.current
        });
        const updatedChatList = chatListRef.current.find(
          (chat) => chat._id.toString() === activeChatData._id.toString()
        );
        // console.log(updatedChatList);

        if (updatedChatList) {
          activeChatRef.current = updatedChatList;
          setActiveChat(() => {
            return updatedChatList;
          });
          // console.log(updatedChatList); right
        }
        if (activeChatRef.current?.messages) {
          // console.log(activeChatRef.current.messages);
          
          setMsgList((curr) => {
            const updatedList = sortMsgs(activeChatRef.current, userId);
            msgListRef.current = updatedList;
            
            return updatedList
          });
        }
        socket.emit("chat-active", { activeChat: activeChatRef.current });
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          navigateTo("/login");
        } else {
          navigateTo(`/${userId}/chats`);
        }
        showSnackbar("error", err?.response?.data?.message || err.message);
      }
    } else { activeChatRef.current = null; setActiveChat(null); return }
  }
  useEffect(() => {
    fetchChats();
    fetchActiveChat();
  }, [chatId]);

  useEffect(() => {
    // console.log(chatId, activeChatRef.current?._id, msgListRef.current);
    if (!chatId?.trim() && !activeChatRef.current || !msgListRef.current) {
      navigateTo(`/${userId}/chats`);
      activeChatRef.current = null;
      setActiveChat(null)
    }
  }, []);

  useEffect(() => {
    const handleMsgDelivered = (msg) => {
      //as the sender may not be active on that particular chat on delivery, so, update the status in the 
      //if that chat is active in sender's side, then update the delivered status immediately
      if (activeChatRef.current._id.toString() === msg.sentTo.chatId.toString()) {
        setChatList((curr) => {
          const updatedList = curr.map((chat) => {
            if (chat._id.toString() === msg.sentTo.chatId.toString()) {
              const updatedChat = {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m._id.toString() === msg._id.toString()) {
                    return {...msg,status:2}
                  } else { return m }
                })
              }
              // console.log(findLastMsg(updatedChat));//correct
              return findLastMsg(updatedChat)
            } else { return chat }
          });
          chatListRef.current = updatedList
          return chatListRef.current;
        });
        setMsgList((curr) => {
          return curr.map((m) => {
            if (m.type === "sent" && m.msg._id.toString() === msg._id.toString()) {
              return { ...m, msg: { ...m.msg, status: 2 } }
            } else { return m }
          })
        });
      } else {
        setChatList((curr) => {
          const updated = curr.map((chat) =>
            chat._id.toString() === msg.sentTo.chatId.toString()
              ? {
                ...chat,
                messages: chat.messages.map((m) => {
                  if (m._id.toString() === msg._id.toString()) {
                    return msg
                  } else { return m }
                })
              }
              : chat
          );
          chatListRef.current = sortChats(updated, userId)
          return chatListRef.current;
        });
      }
    };
    const handleMsgsSeen = ({ msgs, chatId }) => {
      if (activeChatRef.current?._id.toString() === chatId.toString()) {
        setMsgList((curr) => {
          const updated = curr.map((obj) => {
            if (obj.type === "sent") {
              const updatedMsg = msgs?.find((m) => m._id.toString() === obj.msg._id.toString());
              return updatedMsg ? { ...obj, msg: { ...obj.msg, status: 3 } } : obj
            } else {
              return obj;
            }
          });
          msgListRef.current = updated;
          return updated;
        });
        setChatList((curr) => {
          const updatedList = curr.map((chat) => {
            if (chat._id.toString() === chatId.toString()) {
              const updatedChat = {
                ...chat,
                messages: chat.messages.map((msg) => {
                  const updatedMsg = msgs?.find((m) => m._id.toString() === msg._id.toString());
                  return updatedMsg ? { ...updatedMsg, status: 3 } : msg
                }
                )
              }
              return findLastMsg(updatedChat)
            } else { return chat }
          });
          chatListRef.current = sortChatList(updatedList,userId);
          return chatListRef.current;
        });
      } else {
        setChatList((curr) => {
          const updated = curr.map((chat) => {
            if (chat._id.toString() === chatId.toString()) {
              return {
                ...chat,
                messages: chat.messages.map((msg) => {
                  const updatedMsg = msgs?.find((m) => m._id.toString() === msg._id.toString());
                  return updatedMsg ? { ...updatedMsg, status: 3 } : msg
                }
                )
              }
            } else { return chat }
          });
          chatListRef.current = sortChats(updated, userId);
          return chatListRef.current;
        });
      }
    }
    const handleMsgSent = ({ msg, uuid }) => {
      // console.log(msg,"sent! ");
      if (activeChatRef.current._id.toString() === msg.sentTo?.chatId.toString()) {
        setMsgList((curr) => {
          const updatedList = curr.map((m) => {
            if (m.type === "sent" && m.msg.uuid === uuid) {
              return { ...m, msg: { ...m.msg, _id: msg._id, status: 1 } };
            } else {
              return m;
            }
          });
          msgListRef.current = updatedList;
          return updatedList
        });
        setChatList((curr) => {
          const updatedList = curr.map((chat) => {
            if (chat._id.toString() === msg.sentTo?.chatId.toString()) {
              const updatedChat = {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.uuid === uuid
                    ? {...msg, status: 1}
                    : m
                ),
              };
              return findLastMsg(updatedChat)
            } else {
              return chat;
            }
          });
          chatListRef.current = updatedList;
          return chatListRef.current
        });
      } else {
        setChatList((curr) => {
          const updated = curr.map((chat) => {
            if (chat._id.toString() === msg.sentTo.chatId.toString()) {
              return {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.uuid === uuid
                    ? { ...m, _id: msg._id, status: 1, deliveredTo: [], seenBy: [], file: null, from: userId, }
                    : m
                ),
              };
            } else {
              return chat;
            }
          });
          chatListRef.current = sortChats(updated, userId);
          return chatListRef.current;
        });
      }
    }
    const handleMsgReceived = (msg) => {
      if (activeChatRef.current?._id.toString() === msg.sentTo.chatId.toString()) {
        socket.emit("chat-active", { activeChat: activeChatRef.current });
        let updatedList = chatListRef.current.map((chat) => {
          if (chat._id.toString() === msg.sentTo.chatId.toString()) {
            const updatedChat = { ...chat, messages: [...chat.messages, msg] };
            return findLastMsg(updatedChat);
          }
          return chat;
        });

        chatListRef.current = updatedList;
        setChatList(updatedList);

        let lastDate = "";
        if (msgListRef.current.length) {
          for (let i = msgListRef.current.length - 1; i >= 0; i--) {
            if (msgListRef.current[i].type === "date") {
              lastDate = msgListRef.current[i].date;
              break;
            }
          }
        }
        const receivedAt = msg.deliveredTo.find((r) => r.recipientId.toString() === userId.toString())?.at;
        if (lastDate !== "Today") {
          setMsgList((curr) => {
            const updatedMsgList = [...curr, { type: "date", date: "Today" }, { type: "received", msg: { ...msg, receivedAt: formatTime(receivedAt) } }];
            msgListRef.current = updatedMsgList;
            return updatedMsgList
          });
        } else {
          setMsgList((curr) => {
            const updatedMsgList = [...curr, { type: "received", msg: { ...msg, receivedAt: formatTime(receivedAt) } }];
            msgListRef.current = updatedMsgList;
            return updatedMsgList;
          });
        }
      } else {
        // console.log("set unseen for receiver's chatBox");
        setChatList((curr) => {
          const updated = curr.map((chat) =>
            chat._id.toString() === msg.sentTo.chatId.toString()
              ? {
                ...chat,
                messages: [...chat.messages, msg],
              }
              : chat
          );
          chatListRef.current = sortChats(updated, userId);
          return sortChats(updated, userId);
        });
      }
    }
    const handleMsgDeleted = ({ msg, chatId }) => {
      console.log(msg, "was deleted by sender")
      if (activeChatRef.current?._id.toString() === chatId.toString() || findLastMsg(activeChatRef.current).lastMsg?._id.toString() === msg._id.toString()) {
        setChatList((curr) => {
          const updatedList = curr.map((chat) => {
            if (chat._id.toString() === chatId.toString()) {
              const updatedChat = {
                ...chat,
                messages: chat.messages.map((obj) => {
                  if (obj?._id.toString() === msg?._id.toString()) {
                    return { ...obj, deleted: true, file: null }
                  } else {
                    return obj
                  }
                })
              };
              return findLastMsg(updatedChat);
            } else {
              return chat;
            }
          });
          chatListRef.current = updatedList;
          return updatedList;
        });
      }
      if (activeChatRef.current?._id.toString() === chatId.toString()) {
        setMsgList((curr) => {
          const updatedMsgList = curr.map((obj) =>
            obj.msg?._id.toString() === msg?._id.toString() ?
              { ...obj, msg: { ...obj.msg, deleted: true, file: null } } :
              obj
          );
          msgListRef.current = updatedMsgList;
          return msgListRef.current;
        }
        );
      }
    }
    const handleChatPinned=async()=>{
      await fetchChats();
    }
    const handleAddedInGroup=({chat})=>{
      showSnackbar("info",`You were added in '${chat.group.name}' by ${chat.group.name}`);
      fetchChats();
    };
    socket.on("message-sent", handleMsgSent);//sender side
    socket.on("message-delivered", handleMsgDelivered);//sender side
    socket.on("received-message", handleMsgReceived);//receiver side
    socket.on("seen-messages", handleMsgsSeen);//sender side
    socket.on("message-deleted", handleMsgDeleted);//receiver side
    socket.on("chat-pinned-unpinned",handleChatPinned);
    socket.on("added-in-group",handleAddedInGroup);
    return () => {
      socket.off("message-sent", handleMsgSent);
      socket.off("message-delivered", handleMsgDelivered);
      socket.off("received-message", handleMsgReceived);
      socket.off("seen-messages", handleMsgsSeen);
      socket.off("message-deleted", handleMsgDeleted);
      socket.off("added-in-group",handleAddedInGroup);

    }
  }, []);

  useEffect(() => {
    msgListRef.current = msgList;
  }, [msgList]);
  useEffect(() => {
    chatListRef.current = chatList;
  }, [chatList]);
  return (
    <ResizableSplit chatActive={activeChat ? true : false} style={{ '& *': { fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif' } }}
      left={
        <ChatsLeftPane
          setChatList={setChatList}
          activeChat={activeChat}
          chatList={chatList}
          msgList={msgList}
          setActiveChat={setActiveChat}
          userId={userId} />
      }
      right={activeChat ?
        <ChatsRightPane
          loadingMsgs={loadingMsgs}
          activeChat={activeChat}
          chatList={chatList}
          msgList={msgList}
          setMsgList={setMsgList}
          setChatList={setChatList}
          userId={userId} />
        : <EmptyRightPane />
      }
    />
  );
}
