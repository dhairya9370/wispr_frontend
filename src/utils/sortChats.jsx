import findLastMsg from "./findLastMsg";
import sortChatList from "./sortChatList";
import unseenMsgs from "./unseenMsgs";
//fix incorrect rendering of msgs' statuses
export default function sortChats(chatList,userId) {
  if (!chatList || chatList.length === 0 || !userId) return [];
  // const unseenMsgsArr=chatList.map(chat => {
  //   return unseenMsgs(chat,userId);
  // });
  
  const lastMsgArray = chatList.map(chat => {
    return {...findLastMsg(chat), unseen:unseenMsgs(chat,userId)};
  });

  return sortChatList(lastMsgArray,userId);
}
