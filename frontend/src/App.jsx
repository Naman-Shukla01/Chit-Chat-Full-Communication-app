import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./styles/cloud.css"
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./components/VideoMeet";
import HomePage from "./pages/HomePage";
import { HistoryProvider } from "./contexts/HistoryContext";
import History from "./pages/history";
import ChatWindow from "./components/ChatWindow"
import server from "./environment";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AiChatWindow from "./components/AiChatWindow";
import MeetingPage from "./pages/MeetingPage";

function App() {
  const {userData, setUserData} = useContext(AuthContext)
  const [loading, setLoading] = useState(true);
  let [groups, setGroups] = useState([]);
  let [chats, setChats] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        // const userResponse = await handleLogin(undefined, undefined, token)
        const userResponse = await axios.get(`${server.dev}/api/v1/users/login`, {
          params: {token}
        })

        const groupResponse = await axios.get(`${server.dev}/api/group`, {
          headers: {
            Authorization: token,
          },
        });

        const chatResponse = await axios.get(`${server.dev}/api/chat`, {
          headers: {
            Authorization: token,
          },
        });

        console.log("Groups: ", groupResponse.data);
        console.log("Chats: ", chatResponse.data);
        console.log("User: ", userResponse.data);

        setUserData({_id: userResponse.data._id, name: userResponse.data.name, username: userResponse.data.username});
        setChats(chatResponse.data.contacts);
        setGroups(groupResponse.data.groups);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if(!userData && location.pathname!="/"){
    navigate('/auth')
  }
  if (loading) return <div className="transition-transform ">Loading...</div>;
  return (
      
        <HistoryProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/meeting" element={<MeetingPage/>}></Route>
            <Route path="/home" element={<HomePage 
            user={userData}
              groups={groups}
              setGroups={setGroups}
              chats={chats}
              setChats={setChats}/>} />
            <Route path="/:url" element={<VideoMeetComponent />} />
            <Route path="/ai-chatbot" element={<AiChatWindow user={userData}/>} />
          </Routes>
        </HistoryProvider>
      
  );
}

export default App;

