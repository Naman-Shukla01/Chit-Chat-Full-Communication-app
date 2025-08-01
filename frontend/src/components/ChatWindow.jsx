import axios from "axios";
import { useState, useEffect, useRef } from "react";
import server from "../environment";

const ChatWindow = ({
  socket,
  setChats,
  setCurrentGroup,
  currentGroup,
  setCurrentChat,
  currentChat,
  user,
  messages,
}) => {
  const [message, setMessage] = useState("");
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showGroupEditForm, setShowGroupEditForm] = useState(false);
  const bottomMessageRef = useRef();

  useEffect(() => {
    bottomMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e) => setMessage(e.target.value);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("send-message", {
      groupId: currentGroup._id,
      message,
      sender: user._id,
    });
    setMessage("");
  };

  const sendPersonalMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("send-personal-message", {
      receiver: currentChat._id,
      message,
      sender: user._id,
    });
    setMessage("");
  };

  const handleGroupUpdateForm = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    let response = await axios.put(`${server.prod}/api/group`, {
      groupId: currentGroup._id,
      name,
    });

    if (response.status === 200) {
      setCurrentGroup(response.data.group);
    }
  };

  const BackgroundImage = () => (
    <div
      className="absolute p-0 w-full h-screen bg-contain  -z-10 bg-white"
      style={{ backgroundImage: "url('/chat-bg.png')" }}
    ></div>
  );

  const MessageList = () => (
    <div
      className="p-2 w-full h-[85vh] overflow-y-auto space-y-3 pb-28
      [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-transparent
      dark:[&::-webkit-scrollbar-track]:bg-transparent
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-400"
    >
      {messages.map((msg) => {
        const isSender = msg.sender?._id === user._id;
        return (
          <div
            key={msg._id}
            className={`flex w-full ${
              isSender ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg shadow ${
                isSender
                  ? "bg-[#F7B264] text-white rounded-br-none"
                  : "bg-white text-[#9E6948] rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender?.username}</p>
              <p className="text-base text-black">{msg.content}</p>
            </div>
          </div>
        );
      })}
      <div ref={bottomMessageRef}></div>
    </div>
  );

  const MessageInput = ({ onSubmit }) => (
    <form onSubmit={onSubmit} className="flex p-4 fixed bottom-0 w-full">
      <input
        type="text"
        name="message"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="p-2 text-sm border-2 not-sm:w-full w-[40vw] border-[#F7B264] rounded-full bg-white mr-2"
      />
      <button
        type="submit"
        className="text-xl bg-[#F7B264] text-white rounded-full px-4 py-2"
      >
        <img src="/sent-icon.svg" alt="Send" />
      </button>
    </form>
  );

  const GroupEditForm = () => (
    <div className="fixed inset-0 w-full h-full flex bg-black/50 justify-center p-2 z-10">
      <form
        onSubmit={handleGroupUpdateForm}
        className="fixed p-8 space-y-4   flex flex-col bg-white z-10 mt-12 not-sm:p-1 rounded-2xl"
      >
        <div className="flex justify-between items-center pb-8">
          <label className="text-2xl font-bold">Group name</label>
          <div onClick={() => setShowGroupEditForm(false)}>
            <img
              className="font-extrabold"
              src="/cancel-icon.svg"
              alt="Cancel"
            />
          </div>
        </div>
        <input
          type="text"
          name="name"
          defaultValue={currentGroup.groupname}
          className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
        />
        <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-[#f8b262] hover:border-2 border-[#f8b262] hover:scale-[95%] hover:text-[#f8b262] hover:bg-white transition-transform rounded-xl">
          Update
        </button>
      </form>
    </div>
  );

  const OptionsDropdown = ({ idToCopy }) => (
    <div className="absolute right-5 top-12 w-fit rounded-2xl bg-[#FAECDC] p-2 space-y-1">
      <p
        className="flex gap-1 items-center"
        onClick={() => {
          navigator.clipboard.writeText(idToCopy);
          setShowOptions(false);
        }}
      >
        <img className="h-4" src="/copy-icon.svg" alt="Copy" /> Copy ID
      </p>
      {currentGroup && (
        <div
          className="flex gap-1 items-center"
          onClick={() => setShowGroupEditForm(true)}
        >
          <img src="/edit-icon.svg" className="h-4" alt="Edit" /> Edit
        </div>
      )}
    </div>
  );

  const ChatHeader = ({ title, onBack }) => (
    <div className="relative flex justify-between bg-white  drop-shadow-sm shadow-black">
      <div className="flex items-center ">
        <div onClick={onBack} className="p-1 cursor-pointer">
          <img src="../back-icon.svg" alt="Back" />
        </div>
        <h1 className="h-10 flex items-center justify-center w-10 rounded-full font-bold bg-[#F7B264] text-black ">
          {title.charAt(0).toUpperCase()}
        </h1>
        <div
          className="p-2 text-xl font-semibold"
          onClick={() => setShowGroupDetails(true)}
        >
          {title}
        </div>
      </div>
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="m-3 cursor-pointer"
      >
        <img src="/3dots-icon.svg" className="font-bold" alt="Options" />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {currentGroup && (
        <div
          className="w-full not-sm:fixed not-sm:z-50 not-sm:inset-0"
          onClick={() => {
            if (showGroupDetails === true) setShowGroupDetails(false);
          }}
        >
          <ChatHeader
            title={currentGroup.groupname}
            onBack={() => setCurrentGroup(null)}
          />
          {showGroupDetails && (
            <div className="w-1/3 absolute m-2 p-2 overflow-y-auto drop-shadow-lg bg-white rounded-2xl">
              <div className="flex justify-between items-center">
                <h1 className="font-mono font-bold text-lg py-2">Members</h1>
                <p className="font-mono font-bold text-lg py-2">
                  ({currentGroup.members.length})
                </p>
              </div>
              {currentGroup.members.map((member) => (
                <div className="group flex items-center justify-between p-1">
                  {user._id !== member._id ? <>
                  <p>{member.name}</p>
                  <img
                  onClick={() => {
                    setCurrentChat({...member, new:true});
                    setShowGroupDetails(false);
                  setCurrentGroup(null)}}
                    src="/chat-icon.svg"
                    alt="chat"
                    className="h-6 w-6 bg-clip-padding opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                  </>: <p className="text-gray-400">You</p>}
                </div>
              ))}
            </div>
          )}
          {showOptions && <OptionsDropdown idToCopy={currentGroup._id} />}
          {showGroupEditForm && <GroupEditForm />}

          <BackgroundImage />
          <MessageList />
          <form
            onSubmit={sendMessage}
            className="flex p-4 fixed bottom-0 w-full"
          >
            <input
              type="text"
              name="message"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 text-sm border-2 not-sm:w-full w-[40vw] border-[#F7B264] rounded-full bg-white mr-2"
            />
            <button
              type="submit"
              className="text-xl bg-[#F7B264] text-white rounded-full px-4 py-2"
            >
              <img src="/sent-icon.svg" alt="Send" />
            </button>
          </form>
          {/* <MessageInput onSubmit={} /> */}
        </div>
      )}

      {currentChat && (
        <div className="w-full not-sm:fixed not-sm:z-50 not-sm:inset-0">
          <ChatHeader
            title={currentChat.username}
            onBack={() => setCurrentChat(null)}
          />
          {showOptions && <OptionsDropdown idToCopy={currentChat._id} />}

          <BackgroundImage />
          <MessageList />
          {currentChat.new && 
          <div className="absolute top-16 left-2/3 bg-white p-4 rounded-lg drop-shadow-2xl ">
            <p>Add {currentChat.username} to chats </p>
            <button className=" cursor-pointer  bg-[#F7B264] min-w-fit rounded-lg p-1" onClick={()=>{
              setCurrentChat((prev) => ({ ...prev, new: false }));
              setChats((prev) => [...prev, currentChat]);
              axios.post(`${server.prod}/api/chat/create`, {
                username: currentChat.username,
                senderId: user._id,
              });
            }}>Add</button>
            </div>}
          <form
            onSubmit={sendPersonalMessage}
            className="flex p-4 fixed bottom-0 w-full"
          >
            <input
              type="text"
              name="message"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 text-sm border-2 not-sm:w-full w-[40vw] border-[#F7B264] rounded-full bg-white mr-2"
            />
            <button
              type="submit"
              className="text-xl bg-[#F7B264] text-white rounded-full px-4 py-2"
            >
              <img src="/sent-icon.svg" alt="Send" />
            </button>
          </form>
          {/* <MessageInput onSubmit={} /> */}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
