import { Box, CircularProgress, IconButton, Typography, Button, useTheme } from "@mui/material";

import getFileIcon from "./getFileIcon";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import ErrorIcon from '@mui/icons-material/Error';

export default function DocumentBox({ category, file, status }) {
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) return '0 KB';
        if (bytes < 1024) return `${bytes} B`;

        const units = ['KB', 'MB', 'GB', 'TB'];
        let i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes >= 1024 && i < units.length - 1);

        return `${Math.round(bytes)} ${units[i]}`;
    }

    const downloadDoc = async () => {
        try {
            const response = await fetch(file.url);
            if (!response.ok) {
                throw new Error("Failed to fetch file.");
            }
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file.filename || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl); // Memory cleanup
        } catch (error) {
            console.log(error);
            alert("Unable to download file.");
        }
    }
    const theme=useTheme();
    // console.log(file);
    return (
        <Box
            sx={{
                width: { xs: 150, sm: 350 },
                overflow: 'hidden',
                // maxWidth: '100%',
                borderRadius: 2,
            }}>
            <Box
                sx={{
                    background: "rgba(255,255,255,0.7)",
                    color:"black",
                    display: "flex",
                    gap: { xs: 1, sm: 1.5 },
                    alignItems: "center",
                    borderBottom: "1px solid grey",
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                    padding: { xs: 1, sm: 1.5 },
                    minHeight: { xs: 35, sm: 45 }
                }}
            >
                {status === 0 ?
                    (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <CircularProgress
                            size={40}
                            sx={{ color: '#25d366' }}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                color: 'black',
                                width: 27,
                                height: 27,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                    color: "white"
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
                    : status === -1 ?
                        (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <ErrorIcon size={50} sx={{ color: 'red',m:1 }} />
                        </Box>)
                        : category === "pdf" ? (
                            <PictureAsPdfIcon
                                sx={{ fontSize: { xs: 35, sm: 40, md: 45 }, color: '#d32f2f', flexShrink: 0 }} />
                        ) : category === "word" ? (
                            <DescriptionIcon
                                sx={{ fontSize: { xs: 35, sm: 40, md: 45 }, color: '#1976d2', flexShrink: 0 }} />
                        ) : category === "other" ? (
                            <InsertDriveFileIcon sx={{ fontSize: { xs: 35, sm: 40, md: 45 }, color: 'gray', flexShrink: 0 }} />
                        ) : null
                }
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    flex: 1,
                    overflow: 'hidden'
                }}>
                    <Typography
                        sx={{
                            fontSize: { xs: 15, sm: 20, md: 25 },
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.5
                        }}
                    >
                        {file?.filename || file?.name || "Document"}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: { xs: 8, sm: 15, md: 17 },
                            color: "rgba(0, 0, 0, 0.8)",
                            opacity: 0.8,
                            lineHeight: 1.2
                        }}
                    >
                        {formatFileSize(file?.size || file?.file?.size)}
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    justifyContent: "space-evenly",
                    gap: { xs: 0.5, sm: 1 },
                    padding: { xs: 1, sm: 1.5 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (category === "word") {
                            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(file?.url)}`;
                            window.open(googleViewerUrl, "_blank");
                        }
                        else { window.open(file?.url, "_blank"); }
                    }}
                    sx={{
                        color: "black",
                        bgcolor: "white",
                        borderColor: 'black',
                        borderRadius: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        padding: { xs: '6px 12px', sm: '8px 16px' },
                        minWidth: { xs: 'auto', sm: '150px' },
                        flex: { xs: '1 1 auto', sm: '0 0 auto' },
                    }}
                >
                    Open
                </Button>
                <Button
                    variant="outlined"
                    sx={{
                        color: "black",
                        bgcolor: "white",
                        borderColor: 'black',
                        borderRadius: 1,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        padding: { xs: '6px 12px', sm: '8px 16px' },
                        minWidth: { xs: 'auto', sm: '150px' },
                        flex: { xs: 'auto', sm: '0 0 auto' },

                    }}
                    onClick={downloadDoc}
                >
                    Save as...
                </Button>
            </Box>
        </Box>)
}