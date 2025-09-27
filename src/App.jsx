import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatsPage from './ChatsPage';
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import PostRegisterPage from "./PostRegisterPage";
import TestPage from "./TestPage";
import { SocketProvider } from "./SocketProvider";
import { useEffect, useState } from "react";
import socket from "./socket";
import CallsPage from "./CallsPage";

function App() {
  const [backup, setBackup] = useState(true);
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(-1);
  
  useEffect(() => {
    const handleProgress = (currProgress) => {
      
      if (backup) {
        setProgress(currProgress);
        if (currProgress === 100) {
          setBackup(false);
        }
      }
    }
    const handleUserUi = ({ user }) => {
      setUser(user);
    }
    socket.on("backup-progress", handleProgress);
    socket.on("set-user-ui", handleUserUi);

    return () => {
      socket.off("backup-progress", handleProgress);
      socket.off("set-user-ui", handleUserUi);
    };
  }, []);

  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/:id/setupProfile" element={<PostRegisterPage />} />
          <Route path="/:id/chats/:chatId?" element={
            <ChatsPage
              progress={progress}
              backup={backup}
              user={user} />}
          />
          <Route path="/:id/calls/:callId?" element={
            <CallsPage
              user={user} />
            }
          />
          {/* <Route path="/test" element={<TestPage />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}
export default App;
