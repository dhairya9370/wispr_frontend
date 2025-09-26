import React, { useState } from "react";
import { Box, CircularProgress, IconButton, Typography, Button, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import DocumentBox from "./DocumentBox";
import FileDisplayWindow from "./FileDisplayWindow";
import ErrorIcon from '@mui/icons-material/Error';
function getCloudinaryVideoThumbnail(videoUrl, options = {}) {
    const {
        width = 300,
        height = 300,
        second = 1,
        crop = 'fill'
    } = options;

    return videoUrl
        .replace('/upload/', `/upload/so_${second},w_${width},h_${height},c_${crop}/`)
        .replace(/\.(mp4|webm|mov)$/, '.jpg');
}

export default function AttatchedFile({ status = 1, file, isOnlyMedia, msgList }) {
    const [openedFile, setOpenedFile] = useState(false);
    
    return (
        <Box
            sx={{
                width: "fit-content",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mb: isOnlyMedia ? 0 : 1,
                left: 0,
                position: isOnlyMedia ? "static" : "relative",
                boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
                borderRadius: 2,
                cursor: "pointer"
            }}>
            {file.type.includes("image") ?
                status === 0 ? (
                    <Box
                        sx={{
                            width: { xs: 150, sm: 200, md: 300 },
                            minWidth: { xs: 150, sm: 200, md: 250 },
                            height: { xs: 150, sm: 200, md: 300 },
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundImage: `url(${file.url})`,
                            backgroundPosition: "center",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            borderRadius: 1.5,
                            position: 'relative'
                        }}
                    >
                        <CircularProgress
                            size={40}
                            sx={{
                                color: '#25d366'
                            }}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                width: 26,
                                height: 26,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                            onClick={() => {
                                // Handle cancel upload
                                console.log('Cancel upload');
                            }}
                        >
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Box>)
                    :
                    status === -1 ?
                        (<Box
                            sx={{
                                width: { xs: 150, sm: 200, md: 300 },
                                minWidth: { xs: 150, sm: 200, md: 250 },
                                height: { xs: 150, sm: 200, md: 300 },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundImage: `url(${file.url})`,
                                backgroundPosition: "center",
                                backgroundSize: "contain",
                                backgroundRepeat: "no-repeat",
                                borderRadius: 1.5,
                                position: 'relative'
                            }}
                        ><ErrorIcon size={50} sx={{ color: 'red' }} />
                        </Box>)
                        :
                        <Box
                            component="img"
                            src={file?.url}
                            alt="preview"
                            onClick={() => { setOpenedFile(file) }}
                            sx={{
                                height: "100%",
                                maxHeight: 500,
                                maxWidth: "100%",
                                minWidth: { xs: 150, sm: 200, md: 250 },
                                objectFit: "contain",
                                borderRadius: 1.5,
                            }}
                        />
                :
                file?.type?.includes("video") ? (
                    status === 0 ? (
                        <Box
                            sx={{
                                width: { xs: 150, sm: 200, md: 300 },
                                minWidth: { xs: 150, sm: 200, md: 250 },
                                height: { xs: 150, sm: 200, md: 300 },
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: '#f0f0f0', // Grey background like WhatsApp
                                borderRadius: 1.5,
                                position: 'relative'
                            }}
                        >
                            <CircularProgress
                                size={40}
                                sx={{
                                    color: '#25d366' // WhatsApp green color
                                }}
                            />
                            {/* Cancel/Close button */}
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white',
                                    width: 26,
                                    height: 26,
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    }
                                }}
                                onClick={() => {
                                    // Handle cancel upload
                                }}
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                    ) : status === -1 ?
                        (
                            <Box
                                sx={{
                                    width: { xs: 150, sm: 200, md: 300 },
                                    minWidth: { xs: 150, sm: 200, md: 250 },
                                    height: { xs: 150, sm: 200, md: 300 },
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: '#f0f0f0', // Grey background like WhatsApp
                                    borderRadius: 1.5,
                                    position: 'relative'
                                }}
                            >
                                <ErrorIcon size={50} sx={{ color: 'red' }} />
                            </Box>
                        ) :
                        (
                            <Box
                                onClick={() => {
                                    setOpenedFile(file);
                                }}
                                sx={{
                                    position: 'relative',
                                    height: "100%",
                                    minWidth: { xs: 150, sm: 200, md: 250 },
                                    maxHeight: "100%",
                                    maxWidth: "100%",
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={getCloudinaryVideoThumbnail(file?.url)}
                                    alt="Video preview"
                                    sx={{
                                        height: "100%",
                                        maxHeight: "100%",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        borderRadius: 'inherit',
                                    }}
                                />
                                <PlayArrowRoundedIcon
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: { xs: 35, sm: 45 },
                                        color: 'white',
                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                        borderRadius: '50%',
                                        padding: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            transform: 'translate(-50%, -50%) scale(1.1)',
                                            transition: 'all 0.2s ease-in-out'
                                        }
                                    }}
                                />
                                {file?.duration && (
                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontFamily: 'monospace'
                                        }}
                                    >
                                        {formatDuration(file.duration)}
                                    </Typography>
                                )}
                            </Box>
                        )
                ) :
                    file?.type?.includes("pdf") ?
                        <DocumentBox category={"pdf"} file={file} status={status} />
                        :
                        file.type.includes("word") ?
                            <DocumentBox category={"word"} file={file} status={status} />
                            :
                            <DocumentBox category={"other"} file={file} status={status} />
            }
            {openedFile &&
                <FileDisplayWindow
                    setOpenedFile={setOpenedFile}
                    openedFile={openedFile}
                    msgList={msgList}
                />}
        </Box>)
}
