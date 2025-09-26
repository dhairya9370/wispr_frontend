import { Box, Button, TextField, Typography, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from "./api";
import { useSnackbar } from "./SnackbarProvider";
export default function LoginPage() {
    const navigateTo = useNavigate();
    const theme = useTheme();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const { showSnackbar } = useSnackbar();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const onChangeHandler = (e) => {
        setFormData((curr) => {
            return { ...curr, [e.target.name]: e.target.value }
        });
    }
    const [loading, setLoading] = useState(false);
    async function handleSubmit() {
        setLoading(true);
        try {
            const result = await api.post("/login",
                formData
                // {"username":formData.username,"password":formData.password}
            );
            // console.log(result.data);
            setFormData({ username: "", password: "" })
            navigateTo(`/${result.data.user._id.toString()}/chats`);
            showSnackbar("success", "Login Successfull");
        } catch (err) {
            console.log(err?.response);
            showSnackbar("error", err?.response?.data?.message || err.message);
            setLoading(false);
            setFormData({ username: "", password: "" })
        }
    }
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        usernameInputRef.current?.focus();
    }, []);

    return (
        <Box
            sx={{
                '& *': { fontFamily: '"Segoe UI", sans-serif' },
                minHeight: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: theme.palette.mode === "dark" ? theme.palette.background.default : 'rgb(255, 251, 234)',
                // px: 2,
            }}
        >
            <Box
                sx={{
                    pointerEvents: loading ? 'none' : 'auto',
                    width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
                    maxWidth: 400,
                    py: 5,
                    px: 2,
                    mx: 2,
                    border: '1px solid black',
                    borderRadius: 5,
                    bgcolor: "white",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography color="#19bc55" fontWeight={600} fontSize="2em">
                    Wispr
                </Typography>
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "center",
                        alignItems: "center",
                        gap: '16px',
                        color: "black",
                    }}
                >
                    <TextField
                        inputRef={usernameInputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                passwordInputRef.current?.focus();
                            }
                        }}
                        label="Student ID"
                        value={formData.username}
                        name="username"
                        helperText="Enter student ID e.g. BT25CSEXXX"
                        onChange={onChangeHandler}
                        variant="outlined"
                        placeholder={!formData.username ? "Student ID" : undefined}
                        sx={{
                            cursor: "pointer",
                            "& .MuiInputBase-input": {
                                color: "black",   // text color
                            },
                            '& .MuiOutlinedInput-root': {
                                ml: 1,
                                borderRadius: '50px', // Pill shape (50% makes it oval)
                                backgroundColor: "white",
                                '& fieldset': {
                                    borderColor: 'black', // Default border
                                },
                                '&:hover fieldset': {
                                    borderColor: '#128C7E', // Hover state
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#128C7E', // Focus state (matches default primary color)
                                    borderWidth: '2px',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: "grey",
                                ml: 1,
                                '&.Mui-focused': {
                                    color: '#128C7E', // Label focus color
                                },
                            },
                            '& input:-webkit-autofill': {
                                WebkitBoxShadow: 'none',
                                WebkitTextFillColor: "black",
                                transition: 'background-color 5000s ease-in-out 0s',
                            },
                            width: '80vw',
                            maxWidth: '350px',
                        }}
                    />
                    <FormControl
                        variant="outlined"
                        sx={{
                            color: "black",
                            width: '80vw',
                            maxWidth: '350px',
                            "& .MuiInputBase-input": {
                                color: "black",   // text color
                            },
                            '& .MuiOutlinedInput-root': {
                                ml: 1,
                                borderRadius: '50px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '& fieldset': {
                                    borderColor: 'rgb(0,0,0,0.8)',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#128C7E',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#128C7E',
                                    borderWidth: '2px',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#666',
                                ml: 1,
                                '&.Mui-focused': {
                                    color: '#128C7E',
                                },
                            },
                        }}
                    >
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            inputRef={passwordInputRef}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            name="password"
                            onChange={onChangeHandler}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                        sx={{ color: "grey", marginRight: "-2px", display: { xs: "none", sm: "flex" } }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            color="black"
                            label="Password"
                        />
                    </FormControl>
                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            backgroundColor: loading ? "whitesmoke" : "#19bc55",
                            color: loading ? "grey" : "white",
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1.2rem',
                            boxShadow: 0,
                            px: 3,
                            py: 1,
                            "&:hover": {
                                backgroundColor: loading ? "whitesmoke" : "rgb(71, 229, 71)",
                                boxShadow: 0,
                            },
                            "&.Mui-disabled": {
                                backgroundColor: "whitesmoke",
                                color: "grey",
                            },
                        }}
                    >
                        {loading ? 'Verifying…' : 'Login'}
                    </Button>
                </form>


                <Typography variant="body2" sx={{ color: "grey", fontSize: 18 }}>
                    New User?{' '}
                    <span
                        onClick={() => navigateTo('/register')}
                        style={{ color: 'rgb(118, 227, 116)', cursor: 'pointer', fontWeight: "500", fontSize: 18 }}
                    >
                        Register/SignUp
                    </span>
                </Typography>
            </Box>
        </Box>
    );
}
