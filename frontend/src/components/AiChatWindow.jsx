import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import { useEffect } from "react";
import ProfilePage from "../pages/ProfilePage";

const AiChatWindow = ({ user, showProfile, setShowProfile }) => {
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);
  let [generating, setGenerating] = useState(false);

  let bottomMessageRef = useRef();

  useEffect(() => {
    bottomMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyClMihU9qbEgPs5r8pWwdDqJNApSud8LgM",
  });

  const sendPrompt = async (e) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      { sender: user._id, username: user.username, content: message },
    ]);
    let prompt = message;
    setMessage("");
    setGenerating(true);

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setMessages((prev) => [
        ...prev,
        { username: "AI Bhai", content: response.text },
      ]);
      setGenerating(false);

      console.log(messages);
    }
    await main();
  };

  return (
    <div className="relative w-full h-screen">
      <Sidebar showProfile={showProfile} setShowProfile={setShowProfile} />

      <div
        className="absolute p-0 w-full h-screen bg-contain  -z-10 bg-white"
        style={{ backgroundImage: "url('/chat-bg.png')" }}
      ></div>

      <div
        className="p-8 pl-16 not-sm:pl-0 w-full pb-32 h-[85vh] overflow-y-auto space-y-3   
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isSender = msg.sender === user._id;

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
                  <p className="text-sm font-bold mb-1">{msg.username}</p>
                  <p className="text-base text-black">{msg.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center ">
            <img src="/Chat-bot.svg" alt="" className="h-96 w-fit" />
            <p className="text-4xl font-extrabold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse">
                Hey
              </span>
              <span className="bg-clip-text text-purple-500 ">,</span>
              <span className="ml-1 text-transparent bg-clip-text bg-gradient-to-b from-blue-500  via-purple-500 to-pink-500 hover:brightness-110 transition-all duration-300 ease-in-out">
                Ask{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 underline decoration-[#89AAFF] underline-offset-4 transition-all duration-300 ease-in-out hover:brightness-110">
                  anything.
                </span>
              </span>
            </p>
          </div>
        )}
        {generating && (
          <div className=" justify-start max-w-[70%] p-3 rounded-lg shadow bg-white text-orange-400 rounded-bl-none">
            <p className="text-sm font-bold mb-1">AI Bhai</p>
            <div className="flex space-x-1 pt-2">
              <div className="w-2 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-3 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={bottomMessageRef}></div>
        <form onSubmit={sendPrompt} className="flex p-4 fixed bottom-12 w-full">
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
        </form>{" "}
      </div>

      {showProfile && <ProfilePage />}
    </div>
  );
};

export default AiChatWindow;
