import { Box, Button, ClickAwayListener, Dialog, Divider, List, ListItem, ListItemText, MenuItem, Select, Slide, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BrushRoundedIcon from '@mui/icons-material/BrushRounded';
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import EditIcon from '@mui/icons-material/Edit';
import VideoPreviewBox from "./VideoPreviewBox";
import CustomListItemButton from "./CustomListitemButton";
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { useEffect, useRef, useState } from "react";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import LogoutIcon from '@mui/icons-material/Logout';
import VoiceInputs from "./VoiceInputs";
import CircularProgress from '@mui/material/CircularProgress';
import AudioOutputs from "./AudioOutputs";
import api from "./api";
import { Input } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "./SnackbarProvider";

//search user, Error Handling, Then Start working for Status and Calls page immediately,
export default function SettingsDialog({ open, setOpen, user }) {
    const [option, setOption] = useState("chats");
    const [formData, setFormData] = useState({ dp: user?.ui.dp, name: "", language: "english", wallpaper: "", theme: "#ffffff" });
    const [hoverDp, setHoverDp] = useState(false);
    const formDataRef = useRef(formData);
    const navigateTo = useNavigate();
    useEffect(() => {
        if (open === "profile") { setOption("profile") } else { setOption("chats") }
    }, [open]);
    useEffect(() => {
        setFormData((curr) => {
            formDataRef.current = { dp: user?.ui.dp, name: user?.name, language: user?.ui.language, wallpaper: user?.ui.wallpaper, theme: user?.ui.background || "#ffffff" };
            return formDataRef.current;
        });
    }, [user]);
    const [editing, setEditing] = useState(false);
    const [nameLoading, setNameLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [themeSaverLoading, setThemeSaverLoading] = useState(false);
    const [deleteMsgsLoading, setDeleteMsgsLoading] = useState(false);
    const [deleteChatsLoading, setDeleteChatsLoading] = useState(false);
    const [currTheme, setCurrTheme] = useState(localStorage.getItem("theme")||"system");
    const { showSnackbar } = useSnackbar();
    // const theme=useTheme();
    async function handleSubmit(data) {
        // setLoading(true);
        // console.log(data.dp);
        try {
            const result = await api.post("/api/setup-profile", { id: user._id.toString(), formData: data })
            // console.log(result.data);
            setLoading(false); setNameLoading(false); setEditing(false); setThemeSaverLoading(false);
            const updatedUser = result.data?.user;

            if (updatedUser) {
                formDataRef.current = { dp: updatedUser.ui.dp, name: updatedUser.name, language: updatedUser.ui.language, wallpaper: updatedUser.ui.wallpaper, theme: updatedUser.ui.background };
                setFormData(formDataRef.current);
            }
            showSnackbar("success", "Profile Updated!");
        } catch (err) {
            console.log(err, err?.response)
            if (err?.response?.status === 401) {
                navigateTo("/login");
            }
            setLoading(false);
            showSnackbar("error", err?.response?.data?.message || err.message);
        }
    }
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
    }
    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            const result = await api.post("/logout");
            console.log(result.data);
            setLogoutLoading(false);
            navigateTo("/login");
            showSnackbar("success", "Successfully logged out");
        } catch (err) {
            console.log(err);
            showSnackbar("error", err.message);
        }
    }
    const themeOptions = [
        {
            title: "Light Green",
            color: "#b2f2bb",
        },
        {
            title: "Purple",
            color: "#d0bfff",
        },
        {
            title: "Orange",
            color: "#ff922b",
        },
        {
            title: "Blue",
            color: "#91a7ff",
        },
        {
            title: "Grey",
            color: "#ced4da",
        },
        {
            title: "Pink",
            color: "#fcc2d7",
        }
    ];
    const theme = createTheme({
        palette: {
            primary: {
                main: formDataRef.current.theme
            }
        }
    });
    const handleThemeChange = (e) => {
        if (e.target.value === "system") {
            const isDark = window.matchMedia(`(prefers-color-scheme: dark)`).matches;
            if(isDark){
                localStorage.setItem("theme", "dark");
            }else{ 
                localStorage.setItem("theme", "light");
            }
            setCurrTheme("system");
        }
        else if(e.target.value==="dark"||e.target.value==="light"){
            localStorage.setItem("theme", e.target.value);
            setCurrTheme(e.target.value);
        }
        window.location.reload();
    }
    const deleteMsgsHandler = async () => {
        setDeleteMsgsLoading(true);
        try {
            const result = await api.post("/api/delete-all-messages", { id: user._id });
            console.log(result.data);
            setDeleteMsgsLoading(false);
            showSnackbar("success", "Code in progress");

        } catch (err) {
            console.log(err);
            showSnackbar("error", err?.response?.data?.message || err.message || "Code in progress");
        }
    }
    const deleteChatsHandler = async () => {
        setDeleteChatsLoading(true);
        try {
            const result = await api.post("/api/delete-all-chats", { id: user._id });
            console.log(result.data);
            setDeleteChatsLoading(false);
            showSnackbar("success", "Code in progress");
        } catch (err) {
            console.log(err);
            showSnackbar("error", err?.response?.data?.message || err.message || "Code in progress");
        }
    }

    return (
        <Dialog
            // slots={{ transition: Slide }}
            slotProps={{
                backdrop: { sx: { backgroundColor: 'rgba(255, 255, 255, 0)' } },
                transition: { direction: 'right' },
                paper: {
                    sx: {
                        position: 'absolute',
                        bottom: '0.4%',
                        left: '0.3%',
                        m: 0,
                        transform: 'none', // ✅ disables default centering
                    },
                },
            }}
            sx={{
                display: { xs: "none", sm: "none", md: "flex" }, '& *': {
                    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
                },
            }}

            open={open} onClose={() => { setOpen(false) }}>
            <Box
                sx={{ display: "flex", width: 450, height: 450, maxHeight: 450, p: 0 }}>
                <List sx={{ color: theme.palette.background.main, height: 250, maxHeight: 250, py: 0, position: "static" }}>
                    <ListItem disablePadding>
                        <CustomListItemButton selected={option} btn={"chats"} open={true} onClick={() => { setOption("chats") }}>
                            <ForumOutlinedIcon sx={{ mr: 1,  }} />
                            <ListItemText primary="Chats" />
                        </CustomListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <CustomListItemButton selected={option} btn={"calls"} open={true} onClick={() => { setOption("calls") }}>
                            <DuoOutlinedIcon sx={{ mr: 1,  }} />
                            <ListItemText primary="Video & Voice" />
                        </CustomListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <CustomListItemButton selected={option} btn={"personalise"} open={true} onClick={() => { setOption("personalise") }}>
                            <BrushRoundedIcon sx={{ mr: 1,  }} />
                            <ListItemText primary="Personalize" />
                        </CustomListItemButton>
                    </ListItem>
                    <Box sx={{ flexGrow: 1, height: 250 }} />
                    <ListItem disablePadding sx={{ mt: "auto" }}>
                        <CustomListItemButton selected={option} btn={"profile"} open={true} onClick={() => { setOption("profile") }}>
                            <PersonOutlineOutlinedIcon sx={{ mr: 1,  }} />
                            <ListItemText primary="Profile" />
                        </CustomListItemButton>
                    </ListItem>
                </List>

                <Divider orientation="vertical" flexItem />

                <List sx={{
                    overflowX: "hidden", overflowY: "auto", "&::-webkit-scrollbar": {display: "none",}, minHeight: 400, width: 250, maxWidth: 250, pl: 2, alignItems: "flex-start"
                }}>
                    {option === "chats" &&
                        <><Typography sx={{ fontSize: 25, m: 1 }}>Chats</Typography>
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography sx={{ opacity: 0.6 }}>{"Delete All Mesages from all Chats (including files)"}</Typography>
                                <Button loading={deleteMsgsLoading} onClick={deleteMsgsHandler} variant="outlined" color="error">
                                    Clear all messages
                                </Button>
                            </ListItem>
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography sx={{ opacity: 0.6 }}>{"Delete All Chats"}</Typography>
                                <Button loading={deleteChatsLoading} onClick={deleteChatsHandler} variant="outlined" color="error">
                                    Delete all chats
                                </Button>
                            </ListItem>
                        </>
                    }
                    {option === "calls" &&
                        <><Typography sx={{ fontSize: 25, m: 1 }}>Video & Voice</Typography>
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography>{"Video"}</Typography>
                                <Box>
                                    <VideoPreviewBox />
                                </Box>
                            </ListItem>
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography>{"Microphone"}</Typography>
                                <VoiceInputs />
                            </ListItem>
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography>{"Speaker"}</Typography>

                                <AudioOutputs />
                            </ListItem>
                        </>
                    }
                    {option === "personalise" &&
                        <><Typography sx={{ fontSize: 25, m: 1 }}>Personalisation</Typography>
                            <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                                <Typography>{"Theme"}</Typography>
                                <Select
                                    value={currTheme}
                                    sx={{ width: 200 }}
                                    onChange={handleThemeChange}
                                >
                                    <MenuItem value={"light"}>Light</MenuItem>
                                    <MenuItem value={"dark"}>Dark</MenuItem>
                                    <MenuItem value={"system"}>System Default</MenuItem>
                                </Select>
                            </ListItem>
                            <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }} >
                                <ThemeProvider theme={theme}>
                                    <Typography>
                                        Custom Chat Theme
                                    </Typography>
                                    <Box sx={{ width: 200, py: 1, display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start", }}>
                                        {themeOptions.map((item) => (
                                            <Box
                                                key={item.title}
                                                sx={{
                                                    border: `1px solid ${theme.palette.text.primary}`,
                                                    borderRadius: 2,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                    setFormData((curr) => {
                                                        formDataRef.current = { ...curr, theme: item.color };
                                                        return formDataRef.current
                                                    });
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        height: 50,
                                                        width: 50,
                                                        backgroundColor: item.color,
                                                        borderRadius: 2,
                                                        border: formDataRef.current.theme === item.color ? `2px solid ${theme.palette.background.paper}` : `2px solid ${theme.palette.text.primary}`,
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                    <Button variant="contained" color="secondary" sx={{ mt: 0.5 }}>Browse Wallpapers</Button>
                                </ThemeProvider>
                            </ListItem>
                            <ListItem sx={{ justifyContent: "center" }}>
                                <Button
                                    disabled={user?.ui.background === formDataRef.current.theme ? true : false}
                                    variant="contained"
                                    loading={themeSaverLoading}
                                    sx={{ bgcolor: "#19bc55", }}
                                    onClick={() => { setThemeSaverLoading(true); handleSubmit(formDataRef.current) }}
                                >
                                    Save
                                </Button>
                            </ListItem>
                        </>
                    }
                    {option === "profile" &&
                        <>
                            <ListItem sx={{ display: "flex", m: 1 }}>
                                <Button
                                    component="label"
                                    onMouseEnter={() => { setHoverDp(true) }}
                                    onMouseLeave={() => { setHoverDp(false) }}
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
                                            backgroundColor: "rgba(0,0,0,0.5)",
                                        }
                                    }}
                                >
                                    {hoverDp && <EditIcon sx={{ color: theme.palette.background.paper }} />}
                                    {loading && <CircularProgress size="7rem" color="success" />}
                                    <VisuallyHiddenInput
                                        type="file"
                                        accept="image/"
                                        onChange={handleFileUpload}
                                        multiple
                                    />
                                </Button>
                            </ListItem>
                            {/* <ClickAwayListener onClickAway={() => setEditing(false)}></ClickAwayListener> */}
                            <ListItem sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                {!editing && <><Typography sx={{ display: "flex", fontSize: 20, alignItems: "center" }}>
                                    {formDataRef.current?.name}
                                </Typography>
                                    <Button onClick={() => { setEditing(true) }} sx={{
                                        width: 40,
                                        height: 40,
                                        minWidth: 40,
                                    }}>
                                        <EditIcon sx={{ fontSize: 20, color: theme.palette.background.paper }} />
                                    </Button></>}

                                {editing && <>
                                    <Input value={formDataRef.current?.name} onChange={(e) => { setFormData((curr) => { formDataRef.current = { ...curr, name: e.target.value }; return formDataRef.current }) }}></Input>
                                    <Button
                                        disabled={user?.name === formDataRef.current?.name ? true : false}
                                        variant="contained"
                                        loading={nameLoading}
                                        onClick={() => { setNameLoading(true); handleSubmit(formDataRef.current) }}
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
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-start" }}>
                                <Typography sx={{ opacity: 0.6 }}>Student ID</Typography>
                                <Typography>{user?.username}</Typography>
                            </ListItem>
                            <Divider sx={{ my: 2 }} />
                            <ListItem sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Button
                                    size="medium"
                                    onClick={handleLogout}
                                    color="error"
                                    startIcon={<LogoutIcon />}
                                    loading={logoutLoading}
                                    loadingPosition="start"
                                    variant="outlined"
                                >
                                    Log out
                                </Button>
                            </ListItem>
                        </>
                    }
                </List>
            </Box>
        </Dialog >
    )
}
