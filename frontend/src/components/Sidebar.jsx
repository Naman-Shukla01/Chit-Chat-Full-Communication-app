import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white fixed min-h-screen w-14 space-y-4 flex flex-col  p-2">
        <img className="" onClick={()=>navigate("/home")} src="/message-icon.svg" alt="chat" />
        <img onClick={()=>navigate("/meeting")} src="/meeting-icon.svg" alt="meeting" />
        <img onClick={()=>navigate("/ai-chatbot")} src="/ai-chat.svg" alt="ai-chat"  />
        <img src="/account-setting.svg" alt="settings" className="absolute bottom-20 h-10 w-10"/>
      </div>
  )
}

export default Sidebar