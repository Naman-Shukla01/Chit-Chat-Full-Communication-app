import io from "socket.io-client";
import server from "../environment";
import { useContext, useState, useEffect } from "react";
import ChatTab from "../components/ChatTab";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import ProfilePage from "./ProfilePage";
import { AuthContext } from "../contexts/AuthContext";

const ChatPage = ({
  groups,
  setGroups,
  chats,
  setChats,
  showProfile,
  setShowProfile,
}) => {
  const [currentGroup, setCurrentGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const { userData: user } = useContext(AuthContext);
  console.log(user);

  useEffect(() => {
    const newSocket = io(server.prod, {
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

    console.log("User: ", user);
    if (currentGroup) {
      const groupId = currentGroup._id;

      socket.emit("join-group", { groupId });
    }

    if (currentChat) {
      const receiverId = currentChat._id;
      const senderId = user._id;

      socket.emit("join-chat", { senderId, receiverId });
    }

    socket.on("receive-message", (data) => {
      console.log("Received message:", data);
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, currentGroup, currentChat]);

  useEffect(()=>{
    if(currentGroup)
    setGroups((prevGroups)=> (prevGroups.map(group=> group?._id === currentGroup._id? currentGroup: group)))
  },[setCurrentGroup])

  
  return (
    <div className="fixed w-full">
      <div className="flex w-full">
        <div className="flex">
          <Sidebar showProfile={showProfile} setShowProfile={setShowProfile} />
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
          {showProfile && <ProfilePage />}
        </div>
        <div className="w-full m-2">
          <ChatWindow
            socket={socket}
            setChats={setChats}
            setCurrentGroup={setCurrentGroup}
            currentGroup={currentGroup}
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
            user={user}
            messages={messages}
          />

          <div className="relative flex  justify-center items-center">
            <div className="w-full h-screen flex flex-col items-center justify-center text-center ">
              {/* <DotLottieReact src="/Modal Home.lottie" loop autoplay /> */}
              <img src="Messages-people.svg" className="h-[50vh] w-[40vw]"/>
              <p className="text-[#F7B264] text-4xl font-semibold font-mono">Start Chatting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
