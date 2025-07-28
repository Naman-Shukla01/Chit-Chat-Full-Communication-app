import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import "./styles/cloud.css"
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import { AuthContext } from "./contexts/AuthContext";
import VideoMeetComponent from "./components/VideoMeet";
import ChatPage from "./pages/ChatPage";
import { HistoryProvider } from "./contexts/HistoryContext";
import History from "./components/History";
import server from "./environment";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AiChatWindow from "./components/AiChatWindow";
import MeetingPage from "./pages/MeetingPage";

function App() {
  const { userData, setUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [chats, setChats] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user + related data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(`${server.prod}/api/v1/users/login`, {
          params: { token },
        });

        const user = userResponse.data;

        const [groupResponse, chatResponse] = await Promise.all([
          axios.get(`${server.prod}/api/group`, {
            headers: { Authorization: token },
          }),
          axios.get(`${server.prod}/api/chat`, {
            headers: { Authorization: token },
          }),
        ]);

        // Set context + local state
        setUserData({
          _id: user._id,
          name: user.name,
          username: user.username,
        });
        setGroups(groupResponse.data.groups);
        setChats(chatResponse.data.contacts);

        console.log("Fetched user data:", groupResponse);
      } catch (error) {
        console.error("Failed to fetch user or data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Redirect after loading if not logged in
  useEffect(() => {
    if (!loading && !userData && location.pathname !== "" && location.pathname !== "/" && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [loading, userData, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center">
        <div className="flex space-x-3 items-center justify-center">
          <h1 className="text-4xl">Loading </h1>
          <div className="flex space-x-3 items-center justify-center">
            <div className="w-2 h-5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-5 bg-orange-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log("Final userData:", userData);
  
  return (
      
        <HistoryProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/meeting" element={<MeetingPage showProfile={showProfile} setShowProfile={setShowProfile}/>}></Route>
            <Route path="/home" element={<ChatPage 
            
              groups={groups}
              setGroups={setGroups}
              chats={chats}
              setChats={setChats}
              showProfile={showProfile} setShowProfile={setShowProfile}/>} />
            <Route path="/:url" element={<VideoMeetComponent />} />
            <Route path="/ai-chatbot" element={<AiChatWindow user={userData} showProfile={showProfile} setShowProfile={setShowProfile}/>} />
          </Routes>
        </HistoryProvider>
      
  );
}

export default App;

