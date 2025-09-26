import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import Chats from "./ChatComponents/Chats";
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import socket from "./socket";

export default function ChatsPage({ user, progress, backup }) {
  const { id, chatId } = useParams();
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display: "flex", justifyContent: "center", alignItems: "center" })}
        open={backup}
      ><Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, fontSize: 24 }}>
          {progress === -1 ?
            <>Preparing Backup...</>
            :
            progress === 0 ?
              <><CircularProgress thickness={5} sx={{ color: "#19bc55" }} /> Syncing Chats</>
              :
              <><CircularProgress thickness={5} variant="determinate" sx={{ color: "#19bc55" }} value={progress} /> Syncing Chats {progress}%</>
          }
        </Typography>
      </Backdrop>
      <Box sx={{
        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif', '& *': {
          fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
        }, display: "flex", flexDirection: "row", height: "100vh", width: "100vw"
      }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", ml: { xs: 0, sm: 0, md: 7.5 } }}>
          <Sidebar option="chats" userId={id} user={user} />
          {chatId ? <Chats userId={id} chatId={chatId} /> 
          : <Chats userId={id} chatId={null} />}
        </Box>
      </Box>
    </>
  );
}
