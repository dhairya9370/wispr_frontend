import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import getFileIcon from "./getFileIcon";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { Box, CircularProgress, IconButton, Typography, Button, Zoom, useTheme } from "@mui/material";
import { useEffect, useState } from 'react';

export default function FileDisplayWindow({ setOpenedFile, openedFile, msgList,setOpen }) {
    //first make a separate array for the media files, then handle right and left buttons

    const mediaFiles = msgList.filter(obj => 
        obj?.msg?.file?.type?.includes("image") 
        || obj?.msg?.file?.type?.includes("video")
    ).map(obj => obj.msg.file);

    const moveToRightHandler = () => {
        let currIdx=0;
        for (const file of mediaFiles){
            if(file?.url === openedFile?.url ){
                currIdx=mediaFiles.indexOf(file);
            }
        }
        if(mediaFiles.length-1>currIdx){
            setOpenedFile(mediaFiles[currIdx+1]);
        }
    }
    const moveToLeftHandler=()=>{
        let currIdx=0;
        for (const file of mediaFiles){
            if(file?.url === openedFile?.url ){
                currIdx=mediaFiles.indexOf(file);
            }
        }
        if(currIdx>0){
            setOpenedFile(mediaFiles[currIdx-1]);
        }
    }
    const theme=useTheme();
    return (
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                background: theme.palette.background.paper,
                zIndex: 1200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
            <Button
                onClick={() => {setOpenedFile(null);setOpen(false)} }
                sx={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    // padding: '8px 12px',
                    cursor: 'pointer',
                    color: "grey",
                    '&:hover': {
                        bgcolor: "red",
                        color: "white"
                    },
                    borderRadius: 0,

                }}
            >
                <ClearRoundedIcon sx={{ width: 20 }} />
            </Button>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ opacity: 0.8 }}>{openedFile?.filename ||mediaFiles[0]?.filename}</Typography>
            </Box>
            <Box sx={{ overflow: 'hidden', my: 2, display: "flex", justifyContent: { xs: "center", sm: "center", md: "space-between" }, alignItems: "center", gap: { xs: 0, sm: 0, md: 3 }, height: "80vh", width: "100%" }}>
                <Button onClick={moveToLeftHandler} sx={{ display: { xs: "none", sm: "none", md: "inline-flex" }, left: 10, "&:hover": { bgcolor: "rgba(220, 255, 233, 0.47)" } }}>
                    <ChevronLeftIcon sx={{ color: "#19bc55", px: 2, py: 4 }} />
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                    {openedFile?.type?.includes("image") || mediaFiles[0]?.type?.includes("image") ?
                        <Box
                            component="img"
                            src={openedFile?.url || mediaFiles[0]?.url}
                            alt={openedFile?.filename || mediaFiles[0]?.filename}
                            sx={{
                                height: "100%",
                                maxHeight: "100%",
                                width: "90%",
                                maxWidth: "100%",
                                objectFit: "contain",
                            }}
                        />
                        : openedFile?.type.includes("video") || mediaFiles[0]?.type.includes("video") ?
                            <video
                                src={openedFile.url || mediaFiles[0]?.url}
                                controls
                                style={{
                                    height: "80vh",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                }}
                            /> :
                            null
                    }
                </Box>
                <Button onClick={moveToRightHandler} sx={{ display: { xs: "none", sm: "none", md: "inline-flex" }, right: 10, "&:hover": { bgcolor: "rgba(220, 255, 233, 0.47)" } }}>
                    <ChevronRightIcon sx={{ color: "#19bc55", px: 2, py: 4 }} />
                </Button>
            </Box>
            <Box
                sx={{
                    maxHeight: "45px",
                    display: "flex",
                    overflowX: "auto",
                    mb: 1,
                    gap: 1,
                    scrollBehavior: "smooth",
                    '&::-webkit-scrollbar': {
                        display: "none",
                        width: 0,
                        height: 0
                    },
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {mediaFiles.map((file, idx) => (
                    <Box
                        key={idx}
                        onClick={() => setOpenedFile(file)}
                        sx={{
                            width: 45,
                            height: 45,
                            borderRadius: "12px",
                            // border: activePreview?.uuid === obj.uuid ? "3px solid #19bc55" : "2px solid grey",
                            flexShrink: 0,
                            cursor: "pointer",
                            backgroundColor: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            // opacity: activePreview?.uuid === obj.uuid ? 1 : 0.6,
                            transition: "opacity 0.2s ease",
                            maxHeight: 50,
                            minWidth: 40
                        }}
                    >
                        {file?.type.includes("image") ? (
                            <Box
                                component="img"
                                src={file?.url}
                                alt=" "
                                sx={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                }}
                            />
                        ) :
                            file?.type.includes("video") ?
                                <Box
                                    sx={{
                                        height: "100%",
                                        width: "100%",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <PlayArrowRoundedIcon
                                        sx={{
                                            fontSize: { xs: 15, sm: 20 },
                                            color: 'white',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                transform: 'scale(1.1)',
                                                transition: 'all 0.2s ease-in-out'
                                            }
                                        }}
                                    />
                                </Box>
                                :
                                null}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}