import { useEffect, useState } from "react";
import ResizableSplit from "../ResizableSplit";
import CallsLeftPane from "./CallsLeftPane";
import CallsRightPane from "./CallsRightPane";
import EmptyRightPane from "./EmptyRightPane";
import { useSnackbar } from "../SnackbarProvider";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Calls({ userId, callId }) {
    const [activeCall, setActiveCall] = useState(false);
    const [userList, setUserList] = useState([]);
    const {showSnackbar}=useSnackbar();
    const navigateTo=useNavigate();
    async function fetchUsers() {
        try {
            const response = await api.post('/api/get-all-users', { userId });
            const userList= response.data;
            setUserList(userList);

        } catch (err) {
            console.log(err);
            if (err.response?.status === 401) {
                navigateTo("/login");
            }
            showSnackbar("error", err?.response?.data?.message || err.message);
        }
    };
    useEffect(()=>{
        fetchUsers();
    },[userId]);
    return (
        <ResizableSplit
            style={{ '& *': { fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", sans-serif' } }}
            left={
                <CallsLeftPane
                    userList={userList}
                    userId={userId}
                    callId={callId}
                />
            }
            right={activeCall ?
                <CallsRightPane userId={userId} callId={callId} />
                : <EmptyRightPane />
            }
        />);
}
