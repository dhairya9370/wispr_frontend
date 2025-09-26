import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Calls from "./CallComponents/Calls";
import { useParams } from "react-router-dom";
import api from "./api";
import { useSnackbar } from "./SnackbarProvider";
import { useEffect, useState } from "react";

export default function CallsPage() {
    const { id, callId } = useParams();
    const { showSnackbar } = useSnackbar();
    const [user, setUser] = useState(null);
    async function fetchUser() {
        try {
            const user = await api.post("/api/get-user", { userId: id });
            if (user.status === 200) {
                setUser(user.data);
            }
        } catch (err) {
            console.log(err);
            if (err.response?.status === 401) {
                navigateTo("/login");
            }
            showSnackbar("error", err?.response?.data?.message || err.message);

        }
    }
    useEffect(() => {
        fetchUser();
    }, [id]);
    return (
        <Box sx={{
            fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif', '& *': {
                fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
            }, display: "flex", flexDirection: "row", height: "100vh", width: "100vw"
        }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", ml: { xs: 0, sm: 0, md: 7.5 } }}>
                <Sidebar option="calls" userId={id} user={user} />
                <Calls userId={id} callId={callId} />
            </Box>
        </Box>
    );
}
