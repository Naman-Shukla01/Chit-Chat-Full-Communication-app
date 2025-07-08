import axios from "axios";
import { useState, useEffect, useRef } from "react";

const ChatWindow = ({
  socket,
  setCurrentGroup,
  currentGroup,
  setCurrentChat,
  currentChat,
  user,
  messages,
}) => {
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showGroupEditForm, setShowGroupEditForm] = useState(false);
  const bottomMessageRef = useRef();

  useEffect(() => {
    bottomMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const content = e.target.message.value;
    if (content.length === 0) return;

    socket.emit("send-message", {
      groupId: currentGroup._id,
      message: content,
      sender: user._id,
    });

    setMessage("");
  };

  const sendPersonalMessage = (e) => {
    e.preventDefault();
    const content = e.target.message.value;
    if (content.length === 0) return;

    console.log("sender:", user._id, "receiver:", currentChat._id);
    socket.emit("send-personal-message", {
      receiver: currentChat._id,
      message: content,
      sender: user._id,
    });

    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleGroupUpdateForm = async (e) => { 
    e.preventDefault();
    const name = e.target.name.value;
    let response = await axios.put("/api/group", {groupId:currentGroup._id, name, })
  }

  return (
    <div className="w-full ">
      {currentGroup && (
        <div className=" w-full  not-sm:min-w-screen not-sm:min-h-screen">
          <div className="relative flex justify-between not-sm:z-[100] ">
            <div className="flex items-center">
              <h1 className="p-2 rounded-full font-bold bg-[#FFBF78] text-black h-fit w-fit">
                {currentGroup.groupname.charAt(0).toUpperCase()}
              </h1>
              <div className="p-2  text-xl font-semibold">
                {currentGroup.groupname}
              </div>
            </div>

            <div className="">
              <div
                onClick={() => setShowOptions(!showOptions)}
                class="m-3 text-xl font-bold fa-solid fa-ellipsis-vertical"
              >
                <img src="/3dots-icon.svg" className="font-bold" alt="" />
              </div>
            </div>
            {showOptions && (
              <div className="absolute right-5 top-12 w-fit rounded-2xl bg-[#FAECDC] p-2 ">
                <p
                  className="flex gap-1 items-center"
                  onClick={() => {
                    navigator.clipboard.writeText(currentGroup._id);
                    setShowOptions(!showOptions);
                  }}
                >
                  <img className="h-4" src="/copy-icon.svg" alt="" /> Copy group
                  id
                </p>
                <div
                  onClick={() => setShowGroupEditForm(!showGroupEditForm)}
                  className="flex gap-1 items-center"
                >
                  <img src="/edit-icon.svg" className="h-4" alt="" />
                  Edit
                </div>
              </div>
            )}
            {showGroupEditForm && (
              <div className="fixed inset-0 w-full h-full flex bg-black/50  justify-center p-2 ">
                
                <form onSubmit={handleGroupUpdateForm} className="fixed p-8 space-y-4 border-2 border-[#fcd1a0] flex flex-col bg-[#FAECDC] z-10  mt-12 not-sm:p-1 rounded-2xl">
                  <div className="flex justify-between items-center pb-8">
                    <label  htmlFor=""
                  className="text-2xl font-bold text-center">Group name</label>
                  <div onClick={() => setShowGroupEditForm(false)}>
                    <img
                      className="font-extrabold"
                      src="/cancel-icon.svg"
                      alt=""
                    />
                  </div>
                </div>
                  
                  
                  <input
                    type="text"
                    name="name"
                    value={currentGroup.groupname}
                    className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
                    onChange={(e) => e.target.value}
                  />
                  <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-[#f8b262] hover:border-2 border-[#f8b262] hover:scale-[95%] hover:text-[#f8b262] hover:bg-white  transition-transform rounded-xl">
                Update
              </button>
                </form>
              </div>
            )}
          </div>

          <hr />
          <div
            className="absolute p-0 -ml-2 w-full h-screen bg-repeat bg-auto -z-10"
            style={{ backgroundImage: "url('../bg-text.jpeg')" }}
          ></div>
          <div
            className="p-2  w-full  h-[85vh] overflow-y-auto space-y-3 pb-28
  [&::-webkit-scrollbar]:w-2
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
                    className={` p-2 rounded-lg shadow ${
                      isSender
                        ? "bg-[#FFBF78] text-white rounded-br-none"
                        : "bg-white text-[#FFBF78] rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-semibold ">
                      {msg.sender?.username}
                    </p>
                    <p className="text-base text-black">{msg.content}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomMessageRef}></div>
          </div>

          <div className=" fixed  bottom-0">
            <form onSubmit={sendMessage} className="flex p-4 ">
              <input
                type="text"
                name="message"
                placeholder="Type your message"
                value={message}
                onChange={handleChange}
                className="p-2 text-xl border-2 w-[40vw] border-[#FFBF78] rounded-lg bg-white mr-2"
              />
              <button
                type="submit"
                className="text-xl bg-[#FFBF78] text-white rounded-full  px-4 py-2"
              >
                <img src="/sent-icon.svg" className="" alt="" />
              </button>
            </form>
          </div>
        </div>
      )}

      {currentChat && (
        <div className="fixed not-sm:inset-0 not-sm:z-[9999] not-sm:w-screen not-sm:h-screen bg-gray-200">
          <div className="flex justify-between p-1  bg-orange-300">
            <div className="flex ">
              <i
                onClick={() => {
                  setCurrentChat(null);
                }}
                className="sm:hidden m-4 fa-regular font-extrabold text-xl m-2 fa-paper-plane"
              ></i>
              <h1 className="p-3 px-4 my-1 rounded-full font-bold bg-white text-black h-fit w-fit">
                {currentChat.username.charAt(0).toUpperCase()}
              </h1>
              <div className="p-4  text-xl text-white">
                {currentChat.username}
              </div>
            </div>

            <div>
              <i
                onClick={() => setShowOptions(!showOptions)}
                class="m-3  text-xl fa-solid fa-ellipsis-vertical"
              ></i>
            </div>
          </div>
          {showOptions && (
            <div className="fixed right-5 top-12   w-fit rounded-2xl bg-yellow-100 p-2 ">
              <p
                onClick={() => {
                  navigator.clipboard.writeText(currentChat._id);
                  setShowOptions(!showOptions);
                }}
              >
                copy receiver id
              </p>
            </div>
          )}

          <div className="p-4  md:w-[60vw] sm:w-[70vw] pb-32 h-[85vh] overflow-y-auto space-y-3">
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
                    className={`max-w-[70%] p-3 rounded-lg shadow ${
                      isSender
                        ? "bg-orange-400 text-white rounded-br-none"
                        : "bg-white text-orange-400 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-bold mb-1">
                      {msg.sender?.username}
                    </p>
                    <p className="text-base text-black">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className=" fixed  bottom-0 ">
            <form onSubmit={sendPersonalMessage} className="flex p-4 ">
              <input
                type="text"
                name="message"
                placeholder="Type your message"
                value={message}
                onChange={handleChange}
                className="p-2 text-xl border-0 w-[40vw] border-[#FFBF78] rounded-lg bg-white mr-2"
              />
              <button
                type="submit"
                className="text-xl bg-[#FFBF78] text-white rounded-full  px-4 py-2"
              ></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
