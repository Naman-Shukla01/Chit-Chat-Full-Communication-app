import io from "socket.io-client";
import server from "../environment";
import withAuth from "../utils/withAuth";
// import IconButton from "@mui/material/IconButton";
// import RestoreIcon from "@mui/icons-material/Restore";
import { useContext, useState, useEffect } from "react";
import { HistoryContext } from "../contexts/HistoryContext";
// import TextField from "@mui/material/TextField";
import MeetingWindow from "./MeetingWindow";
import ChatTab from "../components/ChatTab";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const HomePage = ({ user, groups, setGroups, chats, setChats }) => {

  const [currentGroup, setCurrentGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); 
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const newSocket = io(server.dev,{
  transports: ["websocket"],         
  withCredentials: true,             
});
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    if (!socket || (!currentGroup && !currentChat)) return;

    console.log("User: ",user)
    if(currentGroup){
        const groupId = currentGroup._id;

    socket.emit("join-group", { groupId });
    }

    if(currentChat){
      const receiverId = currentChat._id;
      const senderId = user._id;

      socket.emit("join-chat", { senderId , receiverId})

    }
    

    socket.on("receive-message", (data) => {
      console.log("Received message:", data);
     if(Array.isArray(data)){
      setMessages(data);
     } else {
      setMessages((prev) => [...prev, data]);
     }
      
      
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, currentGroup, currentChat]);

  return (
    <div className="fixed">
      <div className="flex">    
        <p className="min-w-screen  text-2xl font-extrabold p-2">Chit Chat</p>     
     </div>
      
      
         

    <div className="flex">
      <div className="flex">
      <Sidebar />
    </div>
      <div className="static">
        <ChatTab
          user={user}
          groups={groups}
          setGroups={setGroups}
          currentGroup={currentGroup}
          setCurrentGroup={setCurrentGroup}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          setChats={setChats}
          chats={chats}
        />
      </div>
      <div className="w-full m-2">
        
        <ChatWindow socket={socket} setCurrentGroup={setCurrentGroup} currentGroup={currentGroup} setCurrentChat={setCurrentChat} currentChat={currentChat} user={user} messages={messages} />

          <div className="relative flex mt-[10vh] justify-center items-center">
              {currentChat===null && currentGroup===null &&<div className="clouds">
          <div className="cloud1"></div>
          <div className="cloud2"></div>
          <div className="cloud3"></div>
        </div> }
          </div>
        
      </div>
      
    </div>

     
      
    </div>
  );
};

export default withAuth(HomePage);
