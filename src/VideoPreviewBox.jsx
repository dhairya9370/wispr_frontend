import { useEffect, useRef, useState } from "react";
import { Box, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "./SnackbarProvider";

export default function VideoPreviewBox() {
  const localVideoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const {showSnackbar}=useSnackbar();
  
  useEffect(() => {
    // First get devices and permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((allDevices) => {
        const videoInputs = allDevices.filter(device => device.kind === "videoinput");
        setDevices(videoInputs);
        if (videoInputs.length > 0) {
          setSelectedDevice(videoInputs[0].deviceId);
        }
      })
      .catch(error => {
        showSnackbar("info","Please allow Wispr to access device camera");
        console.error("Error accessing media devices.", error);
      });
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    const constraints = {
      video: { deviceId: { exact: selectedDevice } },
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(error => {
        showSnackbar("info","Please allow Wispr to access device camera");
        console.error("Error starting video stream:", error);
      });
  }, [selectedDevice]);

  return (
    <Box>
      <Select
        sx={{ width: 200, height: 50,mb:1 }}
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
      >
        {devices.map((device) => (
          <MenuItem key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${device.deviceId}`}
          </MenuItem>
        ))}
      </Select>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ height: 150, width: 200, borderRadius: "10px" }}
      />
    </Box>
  );
}
