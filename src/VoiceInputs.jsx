import { useEffect, useState } from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "./SnackbarProvider";

export default function VoiceInputs() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const {showSnackbar}=useSnackbar();
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
                return navigator.mediaDevices.enumerateDevices();
            })
            .then((allDevices) => {
                const audioInputs = allDevices.filter(device => device.kind === "audioinput");
                setDevices(audioInputs);
                if (audioInputs.length > 0) {
                    for (let input of audioInputs) {
                        if (input.label.includes("Default")) {
                            setSelectedDevice(input.deviceId);
                        }
                    }
                }
            })
            .catch(error => {
                showSnackbar("info","Please allow Wispr to access voice inputs");
                console.error("Error accessing media devices:", error);
            });
    }, []);

    return (
        <Select
            sx={{ width: 200, height: 50 }}
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
        >
            {devices.map((device) => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId}`}
                </MenuItem>
            ))}
        </Select>
    );
}
