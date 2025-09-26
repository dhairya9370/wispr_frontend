import { Box,Typography  } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
export default function EmptyRightPane() {
       return (
        <Box sx={{
            height: "100%", 
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Box sx={{ maxWidth: 200, maxHeight: 200, mx: 1 }}>
                <img
                    src="https://res.cloudinary.com/dgmbfhpbw/image/upload/v1752152819/WisprLogo_dclvq7_mtsyda.png"
                    alt="Wispr Logo"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
            </Box>
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 1 }}>
                Wispr
            </Typography>
            <Typography sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center", 
                alignItems: "center",
                fontSize: "1rem",
                opacity: "0.8"
            }}>
                <LockOutlinedIcon sx={{ mr: 1, fontSize: "1rem" }} /> 
                End to End Unencrypted
            </Typography>
        </Box>
    );
}