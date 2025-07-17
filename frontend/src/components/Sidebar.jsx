import { useNavigate } from "react-router-dom";
import { act, useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar = ({ showProfile, setShowProfile }) => {
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(window.location.pathname.slice(1)); // "home", "meeting", "chatbot", etc.\
  console.log(activeTab);

  return (
    <div className="sm:pt-6 sm:pb-6 not-sm:p-1 z-10 bg-white fixed sm:justify-between sm:min-h-screen w-14 items-center  sm:space-y-4 flex sm:flex-col  not-sm:bottom-0 not-sm:min-w-screen not-sm:justify-around ">
      <div className="flex justify-between items-center not-sm:hidden">
        <img
          className="cursor-pointer h-10 w-10"
          src="/logout-icon.svg"
          alt=""
          onClick={() => {
            localStorage.removeItem("token");
            setUserData(null);
            navigate("/");
          }}
        />
      </div>

      <div className="sm:space-y-4 not-sm:flex not-sm:justify-around sm:justify-center not-sm:w-screen  items-center">
        <img
          className={
            activeTab === "home"
              ? "bg-[#FAECDC]  p-2 rounded-full w-10 h-10 cursor-pointer"
              : "w-10 h-10 cursor-pointer"
          }
          onClick={() => {
            setActiveTab("home");
            navigate("/home");
          }}
          src="/message-icon.svg"
          alt="chat"
        />

        <img
          className={
            activeTab === "meeting"
              ? "bg-[#FAECDC] p-2 rounded-full w-10 h-10 cursor-pointer"
              : "w-10 h-10 cursor-pointer"
          }
          onClick={() => {
            setActiveTab("meeting");
            navigate("/meeting");
          }}
          src="/meeting-icon.svg"
          alt="meeting"
        />

        <video
          src="/Ai.mp4"
          muted
          playsInline
          loop
          autoPlay
          className={
            activeTab === "ai-chatbot"
              ? "cursor-pointer ring-1 ring-[#FAECDC] rounded-full w-10 h-10"
              : "cursor-pointer w-10 h-10"
          }
          onClick={() => {
            navigate("/ai-chatbot");
          }}
          alt="ai-chat"
        ></video>
      </div>

      <img
        className={
          "sm:h-10 sm:w-10 not-sm:hidden " +
          (showProfile
            ? "cursor-pointer bg-[#FAECDC] p-2 rounded-full not-sm:inset-0 w-10 h-10"
            : "cursor-pointer w-10 h-10")
        }
        onClick={() => setShowProfile(!showProfile)}
        src="/account-setting.svg"
        alt="settings"
      />
    </div>
  );
};

export default Sidebar;
