export default function findLastMsg(chat){
    let lastMsg = null;
    if (chat.messages && chat.messages.length > 0) {
      lastMsg = chat.messages.reduce((latest, current) => {
        
        const latestAt = new Date(latest.sentTo?.at || 0);

        const currentAt = new Date(current.sentTo?.at || 0);

        return currentAt > latestAt ? current : latest;
      });
    }
    if(lastMsg?.deleted){
      lastMsg.content="This Message was deleted";
    }
   
    return {
      ...chat,
      lastMsg,
    };
}
