
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { styled } from '@mui/material/styles';
import { FormControl, Box, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField, Typography, List, ListItem } from "@mui/material";
import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from './api';
import { useSnackbar } from './SnackbarProvider';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function PostRegisterPage() {
    const { id } = useParams();
    const [formData, setFormData] = useState({ dp: null, name: "", language: "english", wallpaper: "", theme: "#b2f2bb" });
    const [fileIconColor, setFileIconColor] = useState("black");
    const navigateTo = useNavigate();
    const [profilePicUploaded, setProfilePicUploaded] = useState(null);
    const { showSnackbar } = useSnackbar();
    
    const wallpapers = [
        {
            img: "https://images.unsplash.com/photo-1685495856559-5d96a0e51acb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBwJTIwd2FsbHBhcGVyfGVufDB8fDB8fHww",
            title: "Dark Pattern",
        },
        {
            img: "https://images.unsplash.com/photo-1631476517575-7fc2eaf9fa54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW9iaWxlJTIwd2FsbHBhcGVyc3xlbnwwfHwwfHx8MA%3D%3D", // green abstract
            title: "Classic Green",
        },
        {
            img: "https://plus.unsplash.com/premium_photo-1669688398383-0dd93faf55bc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9iaWxlJTIwd2FsbHBhcGVyc3xlbnwwfHwwfHx8MA%3D%3D", // paper texture
            title: "Paper",
        },
        {
            img: "https://images.unsplash.com/photo-1568930290058-7734cf3c16fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwd2FsbHBhcGVyc3xlbnwwfHwwfHx8MA%3D%3D", // stars/dark blue
            title: "Night Sky",
        },
        {
            img: "https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // light beige
            title: "Beige Pattern",
        },
        {
            img: "https://images.unsplash.com/photo-1653484451901-392eed700139?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // minimalist
            title: "Minimal Grey",
        },
        {
            img: "https://plus.unsplash.com/premium_photo-1661855278001-f419e58acb36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW9iaWxlJTIwd2FsbHBhcGVyc3xlbnwwfHwwfHx8MA%3D%3D", // gradient
            title: "Gradient Blue",
        },
        {
            img: "https://images.unsplash.com/photo-1612283592698-6edf01b1edc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // pixel pattern
            title: "Pixel Abstract",
        },
        {
            img: "https://plus.unsplash.com/premium_photo-1686262005780-67155057c2dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // grid
            title: "Soft Grid",
        },
        {
            img: "https://images.unsplash.com/photo-1623399547021-c62b8a47e1ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // doodles
            title: "Chalk Doodle",
        },
        {
            img: "https://images.unsplash.com/photo-1746603858697-cbfb2f5f9eae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // light floral
            title: "Soft Flowers",
        },
        {
            img: "https://plus.unsplash.com/premium_photo-1668112877104-6c4731ab1191?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fG1vYmlsZSUyMHdhbGxwYXBlcnN8ZW58MHx8MHx8fDA%3D", // white texture
            title: "White Canvas",
        },
    ];

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
    const onChangeHandler = (e) => {
        setFormData((curr) => {
            return { ...curr, [e.target.name]: e.target.value }
        });
        // console.log(e.target.value);

    }
    const theme = createTheme({
        palette: {
            primary: {
                main: formData.theme
            }
        }
    });
    const [loading, setLoading] = useState(false);
    async function handleSubmit() {
        setLoading(true);
        try {
            // console.log(formData.dp);
            let fileUpload="";
            if(formData.dp){
                 fileUpload=await api.post("/upload",formData.dp);
            // setFormData((curr)=>{return {...curr, dp: fileUpload.data.url}});
            // console.log(fileUpload.data);
            }
            const result = await api.post("/api/setup-profile", 
                {id , formData:{ ...formData , dp: formData.dp? fileUpload?.data.url: null}} )
            console.log(result.data);
            
            navigateTo(`/${id}/chats`);
            showSnackbar("success", "Profile Setup Successfull");
        } catch (err) {
            console.log(err);
            if(err.response.status===401){
                navigateTo("/login");
            }
            showSnackbar("error", err?.response?.data?.message || err.message);
            setLoading(false);
        }
    }
    const handleFileUpload = (e) => {
        const file=e.target?.files[0];
        if(!file){ return}

        setProfilePicUploaded(URL.createObjectURL(file));
        const form = new FormData();
        form.append("file", file);
        // console.log(form.get("file"));
        
        setFormData((curr) => { return { ...curr, dp: form } });
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
                // bgcolor: 'rgb(255, 251, 234)',
                backgroundImage: "url('https://res.cloudinary.com/dgmbfhpbw/image/upload/v1753376224/chatBackground_wbq79v_xfanlt.jpg')",
                backgroundPosition: "cover",
                backgroundSize: "250%"
            }}>
            <Box
                sx={{
                    pointerEvents: loading ? 'none' : 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: "column",
                    gap: 3,
                    my: 10,
                    mx: 2
                }}>

                <Button
                    component="label"
                    disabled={loading}
                    role={undefined}
                    onMouseEnter={() => { setFileIconColor("greenyellow") }}
                    onMouseLeave={() => { setFileIconColor("black") }}
                    variant="contained"
                    tabIndex={-1}
                    sx={{
                        width: "200px",
                        height: "200px",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: "column",
                        border: "15px solid white",
                        borderRadius: "500px",
                        backgroundSize: "cover",
                        backgroundImage:
                            profilePicUploaded ?
                                `url(${profilePicUploaded})`
                                :
                                "url('https://res.cloudinary.com/dgmbfhpbw/image/upload/v1752080525/115-1150152_default-profile-picture-avatar-png-green_b26ctx.png')",
                        backgroundBlendMode: "darken", // or try 'overlay' / 'multiply'
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.5)", // this will now blend
                        }
                    }}
                >
                    <FileUploadIcon sx={{ color: fileIconColor, fontSize: 50 }} />
                    <VisuallyHiddenInput
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                    />
                    {/* <Typography fontSize={12} color={fileIconColor}>Upload Image</Typography> */}
                </Button>

                <Box
                    sx={{
                        width: "60vw",
                        maxWidth: 900,
                        py: 5,
                        px: 4,
                        mx: 2,
                        border: '1px solid black',
                        borderRadius: 6,
                        bgcolor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <TextField
                        disabled={loading}
                        label="Your Name"
                        value={formData.name}
                        name="name"
                        onChange={onChangeHandler}
                        variant="outlined"
                        sx={{
                            cursor: "pointer",
                            '& .MuiOutlinedInput-root': {
                                ml: 1,
                                // paddingLeft: '12px',
                                borderRadius: '50px', // Pill shape (50% makes it oval)
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                                color: '#666',
                                ml: 1,
                                '&.Mui-focused': {
                                    color: '#128C7E', // Label focus color
                                },
                            },
                            width: '100%',
                            maxWidth: 500,

                        }}
                    />
                    <FormControl disabled={loading} sx={{ width: "50%", minWidth: 80, maxWidth: 500, }}>
                        <InputLabel id="demo-simple-select-autowidth-label" sx={{ "&.Mui-focused": { color: "#128C7E" } }}>Language</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            value={formData.language}
                            onChange={onChangeHandler}
                            name="language"
                            label="Language"
                            sx={{
                                borderRadius: "500px",
                                width: "100%",
                                pl: 1,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "black",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#128C7E",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#128C7E",
                                },
                            }}
                        >
                            <MenuItem value="english">English</MenuItem>
                            <MenuItem value="hindi">Hindi</MenuItem>
                            <MenuItem value="french">French</MenuItem>
                            <MenuItem value="marathi">Marathi</MenuItem>
                        </Select>

                    </FormControl>

                    <Typography variant="h5">Select Chat Wallpaper</Typography>
                    <Box name="wallpaper" sx={{ display: "flex", width: "100%", overflowX: "auto", height: 380, gap: 1, }} >
                        {wallpapers.map((item) => (
                            <Box key={item.img} onClick={() => {
                                setFormData((curr) => {
                                    return { ...curr, wallpaper: item.img }
                                });
                            }}
                                sx={{ height: 350, border: formData.wallpaper === item.img ? '4px solid greenyellow' : '4px solid transparent' }} >
                                <img
                                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.img}?w=248&fit=crop&auto=format`}
                                    alt={item.title}
                                    loading="lazy"
                                    width={200}
                                    height={350}
                                />
                            </Box>
                        ))}
                    </Box>
                    <ThemeProvider theme={theme}>
                        <Typography variant="h5">
                            Select Chat Theme
                        </Typography>
                        <Box sx={{ width: "80%", height: 350, py: 1, overflow: "auto", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start", gap: 1, border: "solid grey 1px", borderRadius: 1 }}>
                            {themeOptions.map((item) => (
                                <Box
                                    key={item.title}
                                    sx={{
                                        border: "solid white 2px",
                                        borderRadius: 3,
                                        boxShadow: 2,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        setFormData((curr) => {
                                            return { ...curr, theme: item.color }
                                        }

                                        );
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "8rem",
                                            width: "8rem",
                                            backgroundColor: item.color,
                                            borderRadius: 3,
                                            border: formData.theme === item.color ? '4px solid grey' : '   2px solid white'
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </ThemeProvider>

                    <Button
                        onClick={handleSubmit}
                        loading={loading}
                        variant="contained"
                        loadingPosition="start"
                        sx={{
                            borderRadius: '50px',
                            bgcolor: '#19bc55',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '1.2rem',
                            boxShadow: 0,
                            px: 3, py: 1,
                            '&:hover': {
                                bgcolor: 'rgb(71, 229, 71)', boxShadow: 0,
                            },
                        }}
                    >
                        {loading ? 'Setting up profile…' : 'Get Started'}
                    </Button>
                </Box>
            </Box >
        </Box >
    )
}