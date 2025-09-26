import formatTime from "./formatTime";
import formatDate from "./formatDate";
import axios from "axios";
import seenByAll from "./seenByAll";
import deliveredToAll from "./deliveredToAll";


export default function sortMsgs(chat, userId) {
    // console.log(chat.messages)
    let msgs = [];
    if (chat && chat?.messages?.length > 0) {
        let recipientId = "";
        let recipients = chat.participants.filter((p) =>
            p._id.toString() !== userId.toString()
        );
        
        for (let msg of chat.messages) {
            if (msg.from.toString() === userId.toString()) {
                msgs.push({ type: "sent", msg: msg });
            } else if (msg.deliveredTo?.some((r) => r?.recipientId?.toString() === userId.toString())) {
                msgs.push({ type: "received", msg: msg })
            }
        }
        if (chat.messages.length > 1) {
            msgs.sort((a, b) => {
                let dateA, dateB;
                if (a.type === "sent") {
                    dateA = new Date(a.msg.sentTo.at);
                } else {
                    dateA = new Date(a.msg.deliveredTo?.find((r) => 
                        r.recipientId.toString() === userId.toString())?.at);
                }

                if (b.type === "sent") {
                    dateB = new Date(b.msg.sentTo.at);
                } else {
                    dateB = new Date(b.msg.deliveredTo?.find((r) => 
                        r.recipientId.toString() === userId.toString())?.at);
                }

                return dateA - dateB;
            });
        }


        let temp1 = {};
        if (msgs[0]?.type === "sent") {
            temp1 = { type: "date", date: formatDate(msgs[0].msg.sentTo.at) };
            msgs.unshift(temp1);
        } else if (msgs[0]?.type === "received") {
            temp1 = { type: "date", date: formatDate(msgs[0].msg.deliveredTo[0].at) };
            msgs.unshift(temp1);
        } else { return msgs }

        for (let i = 1; i < msgs.length; i++) {
            const temp2 = msgs[i];
            let currDate = "";
            if (temp2.type === "sent") {
                currDate = formatDate(temp2.msg.sentTo.at);
            } else if (temp2.type === "received" && temp2.msg.deliveredTo.length > 0) {
                currDate = formatDate(temp2.msg.deliveredTo[0].at);
            }
            if (currDate.toString() === temp1.date.toString()) {
                continue;
            } else {
                if (currDate) {
                    temp1 = { type: "date", date: currDate };
                    msgs.splice(i, 0, temp1);
                    i++;
                }
            }
        }
        // console.log("added date stamps", msgs);
        for (let msg of msgs) {
            if (msg.type === "sent") {
                msg.msg.sentAt = formatTime(msg.msg.sentTo.at);

            } else if (msg.type === "received" && msg.msg.deliveredTo.length) {
                msg.msg.receivedAt = formatTime(msg.msg.deliveredTo[0].at);
            }
        }
        // console.log("formated sent and received msg timings", msgs);
        for (let msg of msgs) {
            if (msg.type === "sent") {

                if (seenByAll(chat.participants,userId,msg.msg.seenBy)) {
                    msg.msg.status = 3;
                } 
                else if (
                    // msg.msg.deliveredTo[0]?.recipientId?.toString() === recipientId.toString()
                    deliveredToAll(chat.participants,userId,msg.msg.deliveredTo)
                ) {
                    msg.msg.status = 2;
                } else {
                    msg.msg.status = 1;
                }
            }
        }
    }
    // console.log(msgs);

    return [...msgs]
}       