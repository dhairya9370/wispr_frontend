import { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import socket from "./socket";
import axios from "axios";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        const pageRouteRegex = /^\/([^\/]+)\/chats(\/[^\/]+)?$/;
        const match = location.pathname.match(pageRouteRegex);
        
        if (match && match[1]) {
            const userId = match[1];
            socket.connect();
            socket.on("connect", async () => {
                console.log("✅ Connected to socket:", socket.id);
                socket.emit("user-connect", userId);
                socket.emit("start-backup",userId);
            });
            return () => {
                socket.off("connect");
                socket.disconnect();
            };
        }
    }, [ location.pathname.split("/")[1]]);
    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
