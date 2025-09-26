import { Box, Button, CircularProgress, ClickAwayListener, Divider, IconButton, Input, List, ListItem, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useRef, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import api from "../api";
import separateUser from "../utils/separateUser";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "../SnackbarProvider";
import VisuallyHiddenInput from "../VisuallyHiddenInput";
import FileDisplayWindow from "./FileDisplayWindow";
import getFileIcon from "./getFileIcon";
import GroupMembersList from "./GroupMembersList";
import CommonGroupsList from "./CommonGroupsList";


export default function ChatOverview({ chatList, msgList, setOverviewOpen, chat, access, userId }) {
    const navigateTo = useNavigate();
    const [formData, setFormData] = useState({ dp: "", name: "", admins: [] });
    const [editing, setEditing] = useState(false);
    const [nameLoading, setNameLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoverDp, setHoverDp] = useState(false);
    const formDataRef = useRef(formData);
    const { showSnackbar } = useSnackbar();
    const { user, receiver } = separateUser(chat, userId);
    const [fileDisplayOpen, setFileDisplayOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const location=useLocation();
    const theme=useTheme();
    useEffect(() => {
        // console.log(user);
        if (chat?.isGroup) {
            setFormData((curr) => {
                formDataRef.current = { dp: receiver?.group?.dp, name: receiver?.group?.name, admins: receiver?.group?.admins };
                return formDataRef.current;
            });
            
            
        } else if (!chat?.isGroup) {
            setFormData((curr) => {
                formDataRef.current = { dp: receiver?.ui?.dp, name: receiver?.name, admins: [] };
                return formDataRef.current;
            });
        }

    }, [chat]);

    async function handleSubmit(data) {
        try {
            const result = await api.post("/api/update-group", { chatId: receiver._id.toString(), formData: data });
            setLoading(false); setNameLoading(false); setEditing(false);
            const updatedChat = result.data?.chat;
            if (updatedChat) {
                formDataRef.current = {
                    dp: updatedChat?.group.dp,
                    name: updatedChat?.group.name,
                    admins: updatedChat?.group.admins
                };
                setFormData(formDataRef.current);
            }
            showSnackbar("success", "Group Details Updated!");
        } catch (err) {
            console.log(err, err?.response)
            if (err?.response?.status === 401) {
                navigateTo("/login");
            }
            setLoading(false);
            showSnackbar("error", err?.response?.data?.message || err.message);
        }
    };
    const handleFileUpload = async (e) => {
        const file = e.target?.files[0];
        if (!file) { return }
        const form = new FormData();
        form.append("file", file);
        // console.log(form.get("file"));
        let fileUpload = null; let result = null; let fileDelete = null;
        setLoading(true);
        try {
            fileUpload = await api.post("/upload", form);
            // console.log(fileUpload.data);
            fileDelete = await api.post("/api/delete-file", { fileUrl: formDataRef.current?.dp });
            formDataRef.current = { ...formDataRef.current, dp: fileUpload?.data?.url }
            await handleSubmit(formDataRef.current);
            showSnackbar("success", "Profile Picture Updated!");
        } catch (err) {
            console.log(err);
            setLoading(false);
            showSnackbar("error", err?.response?.data?.message || err.message);
        }
        setFormData((curr) => { return { ...curr, dp: form } });
    };
    const separateFiles = (chat) => {
        let files = [];
        for (const msg of chat.messages) {
            if (msg.file) {
                files.push(msg.file);
            }
        }
        return files;
    };
    const isAdmin = (userId, chat) => {
        const isAdmin=chat.group.admins.some((admin) => admin.toString() === userId.toString());
        return isAdmin?true:false;
    }
    const formatGroupMembers = (chat) => {
        let members = chat.participants;

        let admins = []; let others = [];
        members = members.map((m) => {
            if (isAdmin(m?._id?.toString(), chat)) {
                admins.push({ ...m, isAdmin: true })
                return { ...m, isAdmin: true };
            } else {
                others.push({ ...m, isAdmin: false })
                return { ...m, isAdmin: false };
            }
        });
        members = [...admins, ...others];
        members = members.filter((m) => m._id.toString() !== userId);
        members = [{ ...user, isAdmin: isAdmin(userId, chat) }, ...members];
        
        return members;
    };
    const groupList = (chat) => {
        let groupList = [];
        groupList = chatList.filter(
            (chat) => chat?.isGroup && chat.participants.some(
                (p) => p._id.toString() === receiver._id.toString()
            )
        );
        return groupList;
    };
    return ( 
        <ClickAwayListener  onClickAway={() => setOverviewOpen(false)}>
        <Box sx={{ overflowY: "auto", ml: 2, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start" }}>
            <IconButton
                onClick={() => setOverviewOpen(false)}
                sx={{
                    color: theme.palette.text.primary,
                    mt: 2, ml: 2,
                }}>
                <ArrowBackIcon />
            </IconButton>
            <ListItem sx={{ display: "flex", }}>
                <Button
                    component="label"
                    onMouseEnter={() => { access && setHoverDp(true) }}
                    onMouseLeave={() => { access && setHoverDp(false) }}
                    variant="contained"
                    sx={{
                        width: "100px",
                        height: "100px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column",
                        border: "1px solid black",
                        borderRadius: "500px",
                        backgroundSize: "cover",
                        backgroundImage: `url(${formDataRef.current?.dp})`,
                        backgroundBlendMode: "darken",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        "&:hover": {
                            backgroundColor:
                                access ? "rgba(0,0,0,0.5)" : "rgba(255, 255, 255, 0)",
                        }
                    }}
                >
                    {access && chat?.isGroup && hoverDp && <EditIcon sx={{color:theme.palette.text.primary}}/>}
                    {access && loading && <CircularProgress size="7rem" color="success" />}
                    {access &&
                        <VisuallyHiddenInput
                            type="file"
                            accept="image/"
                            onChange={handleFileUpload}
                            multiple
                        />}
                </Button>
            </ListItem>
            <ListItem sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                {!editing &&
                    <><Typography
                        sx={{ display: "flex", fontSize: 30, alignItems: "center" }}>
                        {formDataRef.current?.name}
                    </Typography>
                        {access &&
                            <Button
                                onClick={() => { setEditing(true) }}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    minWidth: 40,
                                    ml: 2,

                                }}>
                                <EditIcon sx={{ fontSize: 20, color: theme.palette.text.primary }} />
                            </Button>
                        }
                    </>
                }

                {editing && <>
                    <Input
                        value={formDataRef.current?.name}
                        onChange={(e) => {
                            setFormData((curr) => {
                                formDataRef.current = { ...curr, name: e.target.value };
                                return formDataRef.current
                            })
                        }}>
                    </Input>
                    <Button
                        disabled={
                            chat.isGroup ?
                                receiver.group.name === formDataRef.current?.name ? true : false
                                :
                                receiver?.name === formDataRef.current?.name ? true : false
                        }
                        variant="contained"
                        loading={nameLoading}
                        onClick={() => {
                            setNameLoading(true);
                            handleSubmit(formDataRef.current)
                        }}
                        loadingPosition="center"
                        sx={{
                            bgcolor: "#19bc55",
                            width: 30,
                            height: 30,
                            minWidth: 30,
                        }}><DoneIcon />
                    </Button>
                </>}
            </ListItem>
            {!chat?.isGroup &&
                <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                    <Typography sx={{ opacity: 0.6 }}>Student ID</Typography>
                    <Typography>{receiver?.username}</Typography>
                </ListItem>
            }
            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                <Box sx={{ width: "100%", height: 2, bgcolor: "rgba(212, 212, 212, 1)", }} />
                <Typography sx={{ opacity: 0.7, mt: 1, fontSize: 20 }}>
                    {"Media and Documents"}
                </Typography>
            </ListItem>
            <ListItem >
                {separateFiles(chat).length > 0 ?
                    <>
                        <Box
                            sx={{
                                visibility: "visible",
                                maxHeight: "150px",
                                display: "flex",
                                overflowX: "auto",
                                mb: 1,
                                gap: 1,
                                scrollBehavior: "smooth",
                                '&::-webkit-scrollbar': { display: "none" },
                                msOverflowStyle: "none",
                                scrollbarWidth: "none",
                            }}
                        >
                            {separateFiles(chat)?.map((file) => (
                                <Box
                                    key={file.url}
                                    onClick={() => { setSelectedFile(file); setFileDisplayOpen(true); }}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "12px",
                                        flexShrink: 0,
                                        cursor: "pointer",
                                        backgroundColor: "#f5f5f5",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: 1,
                                        maxHeight: 80,
                                        maxWidth: 80,
                                    }}
                                >
                                    {file.type.startsWith("image/") ? (
                                        <Box
                                            component="img"
                                            src={file.url}
                                            alt="preview"
                                            sx={{
                                                height: "100%",
                                                width: "100%",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    ) :
                                        file.type.startsWith("video/") ?
                                            (<video
                                                src={file.url}
                                                muted
                                                autoPlay
                                                loop
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />)
                                            :
                                            (
                                                getFileIcon(file.type, 50)
                                            )}
                                </Box>
                            ))}
                        </Box>
                        <KeyboardArrowRightIcon onClick={() => { setFileDisplayOpen(true); }} sx={{ mx: 1, visibility: "visible" }} />
                    </> :
                    <Typography>No Files</Typography>
                }

            </ListItem>
            {fileDisplayOpen && <FileDisplayWindow setOpen={setFileDisplayOpen} openedFile={selectedFile} setOpenedFile={setSelectedFile} msgList={msgList} />}

            {chat?.isGroup ?
                <>
                    <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                        <Box sx={{ width: "100%", height: 2, bgcolor: "rgba(212, 212, 212, 1)", }} />
                        <Typography sx={{ opacity: 0.7, mt: 1, fontSize: 20 }}>
                            {formatGroupMembers(chat).length}{" members"}
                        </Typography>
                    </ListItem>
                    <GroupMembersList isViewerAdmin={isAdmin(userId, chat)} memberList={formatGroupMembers(chat)} userId={userId} />
                </>
                :
                //create Group Model separately if possible
                //Fix all Message Sending / delivering / seen statuses
                //fix deleting messages
                //then fix file handeling
                //THen finally work on Calls and statuses
                <>
                    <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                        <Box sx={{ width: "100%", height: 2, bgcolor: "rgba(212, 212, 212, 1)", }} />
                        <Typography sx={{ opacity: 0.7, mt: 1, fontSize: 20 }}>
                            {"Groups in common"}
                        </Typography>
                    </ListItem>
                    <CommonGroupsList groupList={groupList(chat)} userId={userId} />
                </>
            }
            <ListItem>
                <Box sx={{ width: "100%", height: 2, bgcolor: "rgba(212, 212, 212, 1)", }} />
                {/*extra buttons*/}
            </ListItem>

            {/* 
            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                <Typography sx={{ opacity: 0.6 }}>Student ID</Typography>
                <Typography>{user?.username}</Typography>
            </ListItem> 
            */}
        </Box>
        </ClickAwayListener>
    );
}
