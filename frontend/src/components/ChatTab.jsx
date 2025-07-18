import axios from "axios";
import server from "../environment";
import { useState } from "react";

const ChatTab = ({
  user,
  groups,
  setGroups,
  currentGroup,
  setCurrentGroup,
  currentChat,
  setCurrentChat,
  setChats,
  chats,
}) => {
  let [joinGroupClicked, setJoinGroupClicked] = useState(false);
  let [createGroupClicked, setCreateGroupClicked] = useState(false);
  let [createChatClicked, setCreateChatClicked] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(true);
  let [showOptions, setShowOptions] = useState(false);
  let [error, setError] = useState("");

  const createChat = async (e) => {
    try{
        e.preventDefault();

    const res = await axios.post(`${server.prod}/api/chat/create`, {
      username: e.target.name.value,
      senderId: user._id,
    });

    console.log("created chat : ", res);
    setChats((prevChats) => [...prevChats, res.data]);
    setCreateChatClicked(!createChat);
    } catch(err) {
      console.log(err.response)
      setError(err.response.data.error)
    }
    
  };

  const createGroup = async (e) => {
    e.preventDefault();
    console.log(user);
    const res = await axios.post(`${server.prod}/api/group/create`, {
      name: e.target.name.value,
      password: e.target.password.value,
      userId: user._id,
    });
    console.log(res);
    setGroups((prevGroups) => [...prevGroups, res.data]);
    setCreateGroupClicked(!createGroupClicked);
  };

  const joinGroup = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${server.prod}/api/group/join`, {
      name: e.target.name.value,
      password: e.target.password.value,
      userId: user._id,
    });
    console.log(res);
    setGroups((prevGroups) => [...prevGroups, res.data.group]);
    setJoinGroupClicked(!joinGroupClicked);
  };

  return (
    <div className=" sm:mt-2 sm:ml-14 rounded-2xl cursor-pointer p-5 not-sm:p-2 bg-[#f5d8b87e]  sm:w-[35vw] not-sm:w-[100vw] h-[100vh] ">
      <div className="flex justify-between not-sm:m-4">
        <h1 className="text-xl font-bold">Chit Chat</h1>
        <div>
          <img
            onClick={() => {
              setShowOptions(!showOptions);
              setCreateChatClicked(false);
              setCreateGroupClicked(false);
              setJoinGroupClicked(false);
            }}
            class=" text-xl"
            src="/menu-icon.svg"
            alt=""
          />
        </div>
        {createGroupClicked && (
          <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center  ">
            <form
              className="fixed p-8 border-2 border-[#fcd1a0] flex flex-col bg-[#FAECDC] z-10  mt-12 not-sm:p-1 rounded-2xl"
              action=""
              onSubmit={createGroup}
            >
              <div className="flex flex-row justify-between">
                <label
                  htmlFor=""
                  className="text-2xl font-bold text-center pb-8"
                >
                  Create New Group
                </label>
                <div onClick={() => setCreateGroupClicked(false)}>
                  <img
                    className="font-extrabold"
                    src="/cancel-icon.svg"
                    alt=""
                  />
                </div>
              </div>

              <input
                className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
                type="text"
                name="name"
                required
                placeholder="Enter Group name"
              />
              <br />
              <input
                className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
                type="password"
                name="password"
                placeholder="Enter password"
                required
              />
              <br />
              <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-[#f8b6707e] border-2 border-orange-400 hover:scale-[95%] hover:text-[#f8b6707e] hover:bg-white  transition-transform rounded-xl">
                Create
              </button>
            </form>
            
          </div>
        )}
      </div>
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center ">
          <div className="fixed p-8 border-2 border-[#fcd1a0] flex flex-col bg-[#FAECDC] z-10  mt-12 not-sm:p-4 rounded-2xl">
            <div className="flex flex-row justify-between">
              <div className="text-2xl pb-8">New Chat</div>

              <div onClick={() => setShowOptions(false)}>
                <img className="font-extrabold" src="/cancel-icon.svg" alt="" />
              </div>
            </div>
            <input
              type="text"
              className="rounded-xl border-b-orange-300 text-lg bg-white h-12 border-b-4 border-gray-200"
              placeholder="  Enter username "
            />
            <div
              onClick={() => {
                setCreateChatClicked(!createChatClicked);
                setCreateGroupClicked(false);
                setJoinGroupClicked(false);
                setShowOptions(false);
              }}
              className="mt-4  flex hover:bg-yellow-100 rounded-2xl"
            >
              <img src="/user-add-icon.svg" alt="" />
              <div className="text-lg font-semibold m-2">Create chat</div>
            </div>
            <div
              className="  flex hover:bg-yellow-100 rounded-2xl"
              onClick={() => {
                setCreateGroupClicked(!createGroupClicked);
                setJoinGroupClicked(false);
                setCreateChatClicked(false);
                setShowOptions(false);
              }}
            >
              <img src="/add-team-stroke-rounded.svg" alt="" />
              <p className="text-lg font-semibold p-2">Create Group</p>
            </div>
            <div
              className="flex hover:bg-yellow-100 rounded-2xl"
              onClick={() => {
                setJoinGroupClicked(!joinGroupClicked);
                setCreateChatClicked(false);
                setCreateGroupClicked(false);
                setShowOptions(false);
              }}
            >
              <img src="/join-icon.svg" alt="" />
              <p className="text-lg font-semibold p-2"> Join Group</p>
            </div>
          </div>
        </div>
      )}
      {joinGroupClicked && (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center  ">
          <form
            className="fixed p-8 border-2 border-[#fcd1a0] flex flex-col bg-[#FAECDC] z-10  mt-12 not-sm:p-1 rounded-2xl"
            action=""
            onSubmit={joinGroup}
          >
            <div className="flex flex-row justify-between">
              <label htmlFor="" className="text-2xl font-bold text-center pb-8">
                Join Group
              </label>
              <div
                onClick={() => {
                  setJoinGroupClicked(!joinGroupClicked);
                }}
              >
                <img className="font-extrabold" src="/cancel-icon.svg" alt="" />
              </div>
            </div>

            <input
              className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
              type="text"
              name="name"
              required
              placeholder="Enter Group Id"
            />
            <br />
            <input
              className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
              type="password"
              name="password"
              placeholder="Enter password"
              required
            />
            <br />
            <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-orange-400 border-2 border-orange-400 hover:scale-[95%] hover:text-orange-400 hover:bg-white  transition-transform rounded-xl">
              Join
            </button>
          </form>
        </div>
      )}

      {createChatClicked && (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center  ">
          <form
            className="fixed p-8 border-2 border-[#fcd1a0] flex flex-col bg-[#FAECDC] z-10  mt-12 not-sm:p-1 rounded-2xl"
            action=""
            onSubmit={createChat}
          >
            <div className="flex flex-row justify-between">
              <label htmlFor="" className="text-2xl font-bold text-center pb-8">
                Create Chat
              </label>
              <div onClick={() => setCreateChatClicked(!createChatClicked)}>
                <img className="font-extrabold" src="/cancel-icon.svg" alt="" />
              </div>
            </div>

            <input
              className="p-1.5 text-xl border-b-4 border-orange-300 rounded-lg bg-white mr-2"
              type="text"
              name="name"
              required
              placeholder="Enter Username"
            />
            <br />

            <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-orange-400 border-2 border-orange-400 hover:scale-[95%] hover:text-orange-400 hover:bg-white  transition-transform rounded-xl">
              Add
            </button>
          </form>
        </div>
      )}
      <div className="">
        <div>
          <div className="p-2 flex justify-between not-sm:p-1">
            <button
              className={
                chatIsOpen
                  ? "border-b-4 border-orange-300 decoration-white not-sm:text-lg  font-semibold md:text-xl"
                  : "md:text-xl not-sm:text-lg  font-semibold"
              }
              onClick={() => {
                setChatIsOpen(true);
              }}
            >
              Chats
            </button>
            <button
              className={
                !chatIsOpen
                  ? "border-b-4 border-orange-300 decoration-white font-semibold not-sm:text-lg md:text-xl"
                  : "md:text-xl not-sm:text-lg  font-semibold"
              }
              onClick={() => {
                setChatIsOpen(false);
              }}
            >
              Groups
            </button>
          </div>
          {chatIsOpen ? (
            <div className="overflow-y-auto pb-16 h-[80vh] [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-transparent
  dark:[&::-webkit-scrollbar-track]:bg-transparent ">
    
    
              {chats?.map((chat) => {
                return (
                  <div  onClick={() => {
                            setCurrentChat(chat);
                            setCurrentGroup(false);
                          }} className={`p-0.7  hover:bg-[#f8b6707e] ${
                      currentChat && "bg-[#FFBF78]"
                    }  rounded-2xl`}>
                    <div className="flex justify-between ">
                      <div className=" flex items-center">
                        <h1 className="flex w-8 h-8 m-1 rounded-full bg-white font-bold items-center justify-center">
                          {chat.username.charAt(0).toUpperCase()}
                        </h1>
                        <h1
                          className="text-lg rounded pl-2.5 font-semibold"
                          key={chat._id}
                        >
                          {chat.username}
                        </h1>
                      </div>
                    </div>
                  </div>
                );
              })}{" "}
            </div>
          ) : (
            <div className="overflow-y-auto pb-16 h-[80vh] [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-transparent
  dark:[&::-webkit-scrollbar-track]:bg-transparent ">
    
              {groups?.map((group) => {
                return (
                  <div
                    onClick={() => {
                      setCurrentGroup(group);
                      setCurrentChat(false);
                    }}
                    className={`p-0.7  hover:bg-[#f8b6707e] ${
                      currentGroup && "bg-[#FFBF78]"
                    }  rounded-2xl`}
                  >
                    <div className="flex justify-between">
                      <div className=" flex items-center">
                        <h1 className="flex w-8 h-8 m-1 rounded-full bg-white font-bold items-center justify-center">
                          {group.groupname.charAt(0).toUpperCase()}
                        </h1>
                        <h1
                          className="text-lg rounded pl-2.5 font-semibold"
                          key={group._id}
                        >
                          {group.groupname}
                        </h1>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="">{error && <p className="text-red-600 fixed bottom-5 z-20 p-5 bg-[#FAECDC] ">{error}</p> }</div>
    </div>
  );
};

export default ChatTab;
