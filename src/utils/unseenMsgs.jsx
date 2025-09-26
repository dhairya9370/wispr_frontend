export default function unseenMsgs(chat, userId) {
    if (userId) {
        let unseenMsgs = [];
        for (const msg of chat.messages) {
            if (msg.from?.toString() !== userId.toString() &&
                msg.deliveredTo?.some((r) => r.recipientId.toString() === userId.toString()) &&
                !msg.seenBy?.some((r) => r.recipientId.toString() === userId.toString())
            ) {
                unseenMsgs.push(msg);
            }
        }
        return unseenMsgs.length;
    } 
    return 0
}
// {
//     let unseenMsgs = [];
//     for (const msg of chat.messages) {
//         if (msg.from.toString() === receiverId.toString()) {
//             if (msg.deliveredTo[0] && !msg.seenBy[0]) {//handle properly for groups!!!
//                 unseenMsgs.push({ ...msg });
//             }
//         }
//     }
//     return unseenMsgs.length;
// }
