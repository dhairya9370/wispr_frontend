import { Avatar, Box, lighten, ListItem, Typography, useTheme } from "@mui/material";
import AttatchedFile from "./AttatchedFile";
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import RandomMuiColor from "../RandomMuiColor";

export default function ReceivedMsg({ sender, isGroup, msgObj, setSelectedMsg, msgList }) {
    const hasContent = msgObj?.msg?.content?.trim();
    // console.log(msgObj?.msg);
    const theme=useTheme();

    const isOnlyMedia = msgObj?.msg?.file?.type.startsWith("image/") || msgObj?.msg?.file?.type.startsWith("video/");
    return (
        <Box 
        onContextMenu={() => { setSelectedMsg(msgObj) }} 
        className="message received" 
        sx={{
            display: "flex", flexDirection: "column",
            '&::after': {
                content: '""',
                position: 'absolute',
                top: 11.2,
                left: isGroup ? 40 : 11,
                width: 0,
                height: 0,
                borderTop: `8px solid ${theme.palette.mode==="dark"? lighten(theme.palette.background.default, 0.2): "white"}`,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
            },
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
            background:theme.palette.mode==="dark"? lighten(theme.palette.background.default, 0.2): "white",
            maxWidth: '65%',
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
            my: 0.4,
            borderRadius: 1.5,
            borderTopLeftRadius: 0,
        }}>
            {isGroup &&
                <Box sx={{pl: 1,pt:0.5}}>
                    <Typography sx={{textShadow:"1px 1px 1px rgba(0,0,0,0.2)", color: sender?.ui?.background, fontWeight: 700, fontSize: 18 }}>
                        {sender?.name}
                    </Typography>
                </Box>
            }
            <Box 
                sx={{
                    p: 1,pt:0,
                    width: 'fit-content',
                    alignSelf: "flex-start",
                    display: 'flex',
                    flexDirection: msgObj?.msg?.file ? "column" : "row",
                    flexWrap: "wrap",
                    wordBreak: 'break-word',
                    
                }}>

                {msgObj?.msg?.file &&
                    <AttatchedFile
                        msgList={msgList}
                        status={2}
                        file={msgObj.msg.file}
                        isOnlyMedia={!hasContent && isOnlyMedia}
                    />
                }
                {msgObj?.msg?.deleted ?
                    <>
                        <DoNotDisturbAltIcon sx={{ opacity: 0.5, color: "black", fontSize: 18, mr: 0.5, mb: 0.5 }}></DoNotDisturbAltIcon>
                        <Typography sx={{ opacity: 0.5, mb: 0.5, mr: 1, fontStyle: 'italic', alignSelf: "flex-start", justifySelf: "flex-start", }} className="text">
                            {"This message was deleted"}
                        </Typography></>
                    :
                    <Typography sx={{ mb: 0.5, mr: 1, alignSelf: "flex-start", justifySelf: "flex-start", }} className="text">
                        {msgObj.msg.content}
                    </Typography>
                }
                <Typography
                    sx={{

                        color: theme.palette.mode==="dark" || (!hasContent && isOnlyMedia) ? theme.palette.text.primary : "black",
                        position: !hasContent && isOnlyMedia ? "absolute" : "static",
                        display: "flex",
                        flexDirection: "row",
                        justifySelf: "flex-end",
                        alignSelf: "flex-end",
                        alignItems: "center",
                        fontSize: 15,
                        mb: !hasContent && isOnlyMedia ? 0.5 : -0.4,
                        opacity:theme.palette.mode==="dark" || ( !hasContent && isOnlyMedia) ? 1 : 0.5,

                        ml: "auto",
                        right: 18,
                        bottom: !hasContent && isOnlyMedia ? "12px" : "0px",
                    }}>
                    {msgObj.msg.receivedAt}
                </Typography>
            </Box>
        </Box>
    );
}
