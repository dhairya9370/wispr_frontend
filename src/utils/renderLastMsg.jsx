// import DoneIcon from '@mui/icons-material/Done';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { Typography } from '@mui/material';

// function formatDate(date) {
//     const inputDate = new Date(date);
//     const now = new Date();

//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const input = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
//     const diffDays = Math.floor((today - input) / 86400000);

//     if (diffDays === 0) {
//         return inputDate.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//         });
//     } else if (diffDays === 1) {
//         return "Yesterday";
//     } else {
//         const dd = String(inputDate.getDate()).padStart(2, '0');
//         const mm = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-based
//         const yyyy = inputDate.getFullYear();
//         return `${dd}-${mm}-${yyyy}`;
//     }
// }

// export default function findLastMsg(chat, userId, receiver) {
//     if (!chat.isGroup && chat.messages && chat.messages.length>1) {
//         const states = ["pending", "sent", "delivered", "seen"];
//         const now = Date.now();
//         let lastMsg = { ...chat.messages[0] }
//         for (let i = 1; i < chat.messages.length; i++) {
//             if (now - new Date(chat.messages[i].sentTo.at) <= now - new Date(lastMsg.sentTo.at)) {
//                 lastMsg = { ...chat.messages[i] };
//             }
//         }
//         if (lastMsg.from.toString() === userId.toString()) {
//             //seen
//             for (let recipient of lastMsg.seenBy) {
//                 if (recipient.recipientId.toString() === receiver._id.toString()) {
//                     return {
//                         lastMsg: <>
//                             <DoneAllIcon sx={{ fontSize: 16, ml: 0.6, color: 'rgb(0, 104, 241)' }} />
//                             <Typography noWrap
//                                 sx={{
//                                     textOverflow: "ellipsis",
//                                     overflow: "hidden",
//                                     whiteSpace: "nowrap",
//                                     flex: 1, // important to allow shrinking
//                                     minWidth: 0 // needed when inside flex box
//                                 }}>{lastMsg.content}</Typography>
//                         </>,
//                         at: formatDate(lastMsg.sentTo.at)
//                     }
//                 }
//             }
//             //delivered
//             for (let recipient of lastMsg.deliveredTo) {
//                 if (recipient.recipientId.toString() === receiver._id.toString()) {
//                     return {
//                         lastMsg: <>
//                             <DoneAllIcon sx={{ fontSize: 16, ml: 0.6 }} />
//                             <Typography noWrap
//                                 sx={{
//                                     textOverflow: "ellipsis",
//                                     overflow: "hidden",
//                                     whiteSpace: "nowrap",
//                                     flex: 1, // important to allow shrinking
//                                     minWidth: 0 // needed when inside flex box
//                                 }}>{lastMsg.content}</Typography>
//                         </>,
//                         at: formatDate(lastMsg.sentTo.at)
//                     }
//                 }
//             }
//             //sent
//             if (lastMsg.sentTo.chatId.toString() === chat._id.toString()) {
//                 return {
//                     lastMsg: <>
//                         <DoneIcon sx={{ fontSize: 16, ml: 0.6 }} />
//                         <Typography noWrap
//                             sx={{
//                                 textOverflow: "ellipsis",
//                                 overflow: "hidden",
//                                 whiteSpace: "nowrap",
//                                 flex: 1, // important to allow shrinking
//                                 minWidth: 0 // needed when inside flex box
//                             }}>{lastMsg.content}</Typography>
//                     </>,
//                     at: formatDate(lastMsg.sentTo.at)
//                 }

//             }
//             else {//pending
//                 return {
//                     lastMsg: <>
//                         <AccessTimeIcon sx={{ fontSize: 14, ml: 0.6 }} />
//                         <Typography noWrap
//                             sx={{
//                                 textOverflow: "ellipsis",
//                                 overflow: "hidden",
//                                 whiteSpace: "nowrap",
//                                 flex: 1, // important to allow shrinking
//                                 minWidth: 0 // needed when inside flex box
//                             }}>{lastMsg.content}</Typography>
//                     </>,
//                     at: formatDate(lastMsg.sentTo.at)
//                 }
//             }
//         }
//         else {
//             return {
//                 lastMsg: <Typography noWrap
//                     sx={{
//                         textOverflow: "ellipsis",
//                         overflow: "hidden",
//                         whiteSpace: "nowrap",
//                         flex: 1, // important to allow shrinking
//                         minWidth: 0 // needed when inside flex box
//                     }}>{receiver.name.trim().split(" ")[0] + ": " + lastMsg.content}</Typography>,
//                 at: formatDate(lastMsg.sentTo.at)
//             }
//         }
//     }
//     else if(chat.isGroup){
//         return { lastMsg: "group", at: "group" }
//     }
//     else {
//         return { lastMsg: "", at: "" }
//     }
// }


//fix now seen property of sender's and receivers msgs, according to their status of activeChat, and hence handle sen-messages, and chat-active on click chatBox
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import seenByAll from './seenByAll';
import deliveredToAll from './deliveredToAll';



function formatDate(date) {
    const inputDate = new Date(date);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const input = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const diffDays = Math.floor((today - input) / 86400000);

    if (diffDays === 0) {
        return inputDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } else if (diffDays === 1) {
        return "Yesterday";
    } else {
        const dd = String(inputDate.getDate()).padStart(2, '0');
        const mm = String(inputDate.getMonth() + 1).padStart(2, '0');
        const yyyy = inputDate.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }
}

export default function renderLastMsg(lastMsg, userId, receiver) {

    if (!lastMsg || !lastMsg.sentTo || !lastMsg.sentTo.at) {
        return { content: "", at: "" };
    }

    //separate recepient from receiver
    let recipient=null;
    const senderId= lastMsg.from;
    if(receiver?.isGroup){
        recipient=receiver.participants.find((p)=> p._id.toString()===senderId.toString());
    }else{
        recipient=receiver;
    }
    
    const time = formatDate(lastMsg.sentTo.at);

    let text = (<></>);
    if (lastMsg?.content !== "") {
        text = (
        <Typography noWrap sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0
        }}>
            {recipient.name.trim().split(" ")[0] + ": " }
            {lastMsg?.content}
        </Typography>)
    }
    if (lastMsg?.file) {
        // console.log(lastMsg.file);
        if (lastMsg.file?.type?.includes("image")) {
            text = (
                <>
                <Typography>
                    {recipient.name.trim().split(" ")[0] + ": " }
                </Typography>
                <ImageOutlinedIcon />
                    <Typography noWrap sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        flex: 1,
                        minWidth: 0
                    }}>
                        { lastMsg?.content || "Image"}
                    </Typography>
                </>)
        } else if (lastMsg.file?.type?.includes("video")) {
            text = (<>
                <Typography>
                    { recipient.name.trim().split(" ")[0] + ": " }
                </Typography>
                <VideocamOutlinedIcon />
                <Typography noWrap sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0
                }}>
                    {lastMsg?.content || "Video"}
                </Typography>
            </>)

        } else {
            text = (<>
                <Typography>
                    {recipient.name.trim().split(" ")[0] + ": " }
                </Typography>
                <InsertDriveFileIcon />
                <Typography noWrap sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0
                }}>
                    {lastMsg?.content || lastMsg?.file?.name || lastMsg?.file?.file?.name || "Document"}
                </Typography></>)
        }
    }

    const msgText = text;
    if (lastMsg.from.toString() === userId.toString()) {
        // Seen
        if (seenByAll(receiver.isGroup?receiver.participants:[receiver],userId,lastMsg.seenBy)) {
            // console.log("seen last msg");            
            return {
                content: <>
                    <DoneAllIcon sx={{
                        fontSize: 20, ml: 0.6,
                        color: 'rgba(0, 149, 255, 1)',
                        '& path': {
                            stroke: 'rgba(0, 149, 255, 1)',         // border color
                            strokeWidth: 0.7         // border thickness
                        }
                    }} />
                    {msgText}
                </>,
                at: time
            };
        }
        // Delivered
        if (deliveredToAll(receiver.isGroup?receiver.participants:[receiver],userId,lastMsg.deliveredTo)) {
            // console.log("delivered last msg");
            return {
                content: <>
                    <DoneAllIcon sx={{ fontSize: 20, ml: 0.6 }} />
                    {msgText}
                </>,
                at: time
            };
        }
        // Sent
        if (lastMsg?.status===1 || lastMsg?.sentTo?.chatId) {
            // console.log("sent last msg");
            return {
                content: <>
                    <DoneIcon sx={{ fontSize: 20, ml: 0.6 }} />
                    {msgText}
                </>,
                at: time
            };
        }
        // Pending
        // console.log(lastMsg);
        return {
            content: <>
                <AccessTimeIcon sx={{ fontSize: 18, ml: 0.6 }} />
                {msgText}
            </>,
            at: time
        };
    } else {
        // console.log("last msg sent by recipient");
        return {
            content: (
                <>
                    { msgText}
                </>
            ),
            at: time
        };
    }
}
