import { Box, Button, FormControl, FormLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import api from "./api";
import { useSnackbar } from "./SnackbarProvider";
export default function RegisterPage() {
    const [formData, setFormData] = useState({ id: "", email: "", password: "" });
    const navigateTo = useNavigate();
    const onChangeHandler = (e) => {
        setFormData((curr) => {
            return { ...curr, [e.target.name]: e.target.value.toString() }
        });
    }
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { showSnackbar } = useSnackbar();
    const theme=useTheme();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    async function handleSubmit() {
        setLoading(true);
        try {
            const result = await api.post("/api/register", formData);

            navigateTo(`/${result.data.user._id}/setupProfile`);
            // console.log(result.data);
            showSnackbar("success","Registered Successfully !");
        } catch (err) {
            console.log(err);
            if(err.response?.status===401){
                navigateTo("/login");
            }
            showSnackbar("error", err?.response?.data?.message || err.message);
            setFormData({ id: "", password: "", email: "" });
            setLoading(false);
        }
    }
    return (
        <Box
            sx={{
                '& *': { fontFamily: '"Segoe UI", sans-serif' },
                minHeight: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor:theme.palette.mode==="dark"?"black": 'rgb(255, 251, 234)',
                // px: 2,
            }}
        >
            <Box
                sx={{
                    pointerEvents: loading ? 'none' : 'auto',
                    width: { xs: '100%', sm: '80%', md: '60%', lg: '40%' },
                    maxWidth: 600,
                    py: 5, px: 6,
                    mx: 2,
                    border: '1px solid black',
                    borderRadius: 5,
                    bgcolor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <Typography color="#19bc55" fontWeight={600} fontSize="2em">
                    SignUp
                </Typography>
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "center",
                        alignItems: "center",
                        gap: '16px',
                    }}
                >
                    <TextField
                        label="Student ID"
                        value={formData.id}
                        name="id"
                        helperText="Enter your student ID"
                        onChange={onChangeHandler}
                        variant="outlined"
                        type="text"
                        sx={{
                            width: '60vw',
                            maxWidth: '400px',
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

                        }}
                    />
                    <TextField
                        label="Email address"
                        value={formData.email}
                        name="email"
                        type="email"
                        onChange={onChangeHandler}
                        variant="outlined"
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
                            width: '60vw',
                            maxWidth: '400px',
                        }}
                    />
                    <FormControl
                        variant="outlined"
                        sx={{
                            width: '60vw',
                            maxWidth: '400px',
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
                        }}
                    >
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
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
                                        sx={{color:"grey", marginRight: "-2px", display: { xs: "none", sm: "flex" } }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            bgcolor: '#19bc55',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '1.2rem',
                            color:"white",
                            px: 3, py: 1,
                            '&:hover': {
                                bgcolor: 'rgb(0, 100, 0)',
                            },
                        }}
                    >
                        {loading ? 'Getting Started…' : 'Register'}
                    </Button>
                </form>
                <Typography variant="body2" sx={{color:"grey", fontSize: 18 }}>
                    Existing User?{' '}
                    <span
                        onClick={() => navigateTo('/login')}
                        style={{ color: 'rgb(101, 202, 99)', cursor: 'pointer', fontWeight: "500", fontSize: 18 }}
                    >
                        Login
                    </span>
                </Typography>
            </Box>
        </Box>
    );
}
