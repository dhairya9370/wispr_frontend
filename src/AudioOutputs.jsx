import { useEffect, useState, useRef } from "react";
import { Box, MenuItem, Select, Button, Typography } from "@mui/material";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
export default function AudioOutputs() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const audioRef = useRef(null);
    const [audioOn, setAudioOn] = useState(false);
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then((allDevices) => {
                const audioOutputs = allDevices.filter(device => device.kind === "audiooutput");
                setDevices(audioOutputs);
                if (audioOutputs.length > 0) {
                    setSelectedDevice(audioOutputs?.[0].deviceId);
                }
            })
            .catch(error => {
                console.error("Error accessing media devices:", error);
            });
    }, []);

    useEffect(() => {
        if (audioRef.current && selectedDevice) {
            audioRef.current.setSinkId(selectedDevice).catch(err => console.error("Error setting output device:", err));
        }
    }, [selectedDevice]);

    const playTestSound = () => {
        const audio = audioRef.current;
        if (!audioOn) {
            audio.currentTime = 0;
            audio.play();
            setAudioOn(true);
            setTimeout(() => {
                audio.pause();
                setAudioOn(false);
                audio.currentTime = 0;
            }, 5000); // stop after 5s
        } else {
            audio.pause();
            setAudioOn(false);
            audio.currentTime = 0;
        }
    };

    return (
        <Box>
            <Select
                sx={{ width: 200, height: 50, mb: 2 }}
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
            >
                {devices.map((device) => (
                    <MenuItem key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker ${device.deviceId}`}
                    </MenuItem>
                ))}
            </Select>
            <Typography sx={{mb:1}}>Test Audio</Typography>
            <Button
                variant="outlined"
                color="inherit"
                onClick={playTestSound}
                sx={{
                    width: 40,
                    height: 40,
                    minWidth: 40,
                    border: "1px solid black",
                    borderRadius: 1,
                    p: 0,
                }}
            >
                {audioOn ? <PauseRoundedIcon sx={{ m: 0 }} /> : <PlayArrowRoundedIcon sx={{ m: 0 }} />}
            </Button>

            <audio
                ref={audioRef}
                src="https://res.cloudinary.com/dgmbfhpbw/video/upload/v1754141816/early-sunrise-517_hpxibm.mp3"
                style={{ display: "none" }}
            />
        </Box>
    );
}
