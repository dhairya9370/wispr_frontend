import separateUser from "./separateUser";

export default function sortChatList(chatList,userId) {
  const pinned = [];
  // console.log(chatList);
  
  const unPinned = chatList.filter(chat => {
    const isUnpinned = !separateUser(chat, userId)?.user?.ui?.pinned?.includes(chat._id.toString());
    if (!isUnpinned) pinned.push(chat);
    return isUnpinned;
  });

  const sorted = unPinned.sort((a, b) => {
    const aTime = new Date(a.lastMsg?.at);
    const bTime = new Date(b.lastMsg?.at);
    return bTime - aTime; // descending (latest first)
  });
  return [...pinned,...sorted]
}