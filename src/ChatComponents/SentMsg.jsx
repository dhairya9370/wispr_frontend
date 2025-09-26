import { Box, Button, Chip, CircularProgress, Divider, ListItem, Typography, IconButton, useTheme, } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from "react";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';

import DescriptionIcon from '@mui/icons-material/Description';
import AttatchedFile from "./AttatchedFile";
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';

export default function SentMsg({ msgObj, setSelectedMsg, msgList }) {
    // const states = ["pending", "sent", "delivered", "seen"];
    // let statusCode=0;
    // for(let state of states){if(msg.status===state){statusCode=states.indexOf(state)}}
    // const [status, setStatus] = useState(msg.status);
    function StatusIcon({status }) {
        switch (status) {
            case 0:
                return <AccessTimeIcon sx={{ fontSize: 18, ml: 0.6,}} />;
            case 1:
                return <DoneIcon sx={{ fontSize: 20, ml: 0.6,  }} />
            case 2:
                return <DoneAllIcon sx={{ fontSize: 20, ml: 0.6,}} />
            case 3:
                return <DoneAllIcon sx={{
                    fontSize: 20,
                    ml: 0.6,
                    color: 'rgba(0, 149, 255, 1)',
                    '& path': {
                        stroke: 'rgba(0, 149, 255, 1)',
                        strokeWidth: 0.7
                    }, 
                }} />;
            default:
                return <AccessTimeIcon sx={{ fontSize: 16, ml: 0.6, }} />;
        }
    }
    const theme = useTheme();
    const hasContent = msgObj?.msg?.content?.trim();
    const isOnlyMedia = msgObj?.msg?.file?.type.startsWith("image/") || msgObj?.msg?.file?.type.startsWith("video/");
    const openFilePreview = () => {
    }
    //fix this ui of files,  done
    // dont show any previews of docs, done
    // just handle properly the images and videos, 
    // make the image viewing window, 
    // and also the uploading status of progress circle
    return (
        <ListItem className="message sent" onContextMenu={() => { setSelectedMsg(msgObj) }}
            sx={{
                p: 0.8,
                my: 0.4,
                borderRadius: 1.5,
                width: 'fit-content',
                minWidth: 50,
                display: 'flex',
                flexDirection: msgObj?.msg?.file ? "column" : "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                background:theme.palette.mode==="dark"?"#057f68ff": "#dcf8c6",
                maxWidth: { xs: "90%", sm: "80%", md: '65%' },
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                wordBreak: 'break-word',
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    right: -5,
                    width: 0,
                    height: 0,
                    borderTop: `8px solid ${theme.palette.mode==="dark"?"#057f68ff": "#dcf8c6"}`,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                },
            }}>
            {msgObj?.msg?.file && !msgObj?.msg?.deleted ?
                <AttatchedFile msgList={msgList} status={msgObj.msg?.status} file={msgObj.msg.file} isOnlyMedia={!hasContent && isOnlyMedia} />
                : null
            }
            {msgObj?.msg?.deleted ?
                (<Typography sx={{opacity:0.5, mb: 0.5, mr: 1, ml: 0.7,fontStyle: 'italic', alignSelf: "flex-start" }} className="text">
                    {/* <DoNotDisturbAltIcon sx={{opacity:0.5,color:"black"}}></DoNotDisturbAltIcon> */}
                    {"You deleted this message"}
                </Typography>)
                :
                (<Typography sx={{ mb: 0.5, mr: 1, ml: 0.7, alignSelf: "flex-start" }} className="text">
                    {msgObj.msg.content}
                </Typography>)
            }
            <Typography
                sx={{
                    textShadow:!hasContent && isOnlyMedia ? '1px 1px 2px rgba(0,0,0,0.5)':"",
                    filter: !hasContent && isOnlyMedia ? "drop-shadow(2px 2px 2px rgba(0,0,0,1))" : 'none',
                    color: theme.palette.mode==="dark" || (!hasContent && isOnlyMedia) ? theme.palette.text.primary : "black",
                    position: !hasContent && isOnlyMedia ? "absolute" : "static",
                    // zIndex:15,   
                    display: "flex",
                    flexDirection: "row",
                    justifySelf: "flex-end",
                    alignSelf: "flex-end",
                    alignItems: "center",
                    fontSize: 15,
                    mb: !hasContent && isOnlyMedia ? 0.5 : -0.4,
                    opacity:theme.palette.mode==="dark" || ( !hasContent && isOnlyMedia) ? 1 : 0.5,
                    ml: "auto",
                    right: 15,
                    bottom: !hasContent && isOnlyMedia ? "12px" : "0px",
                }}>
                {msgObj.msg.sentAt}
                <StatusIcon
                    status={msgObj.msg.status}
                />
            </Typography>
        </ListItem>
    );
}
