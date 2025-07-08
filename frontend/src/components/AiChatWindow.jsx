import { GoogleGenAI } from "@google/genai";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import { useEffect } from "react";

const AiChatWindow = ({user}) => {
  let [message, setMessage] = useState("");
  let [messages, setMessages] = useState([]);

  let bottomMessageRef = useRef();
  
  
    useEffect(() => {
      bottomMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyClMihU9qbEgPs5r8pWwdDqJNApSud8LgM",
  });

  const sendPrompt = async (e) => {
    e.preventDefault();
    let prompt = message;
    setMessage("");

    async function main() {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      setMessages((prev)=> [...prev, {sender: user._id, username: user.username, content: prompt}, {username: "AI Bhai", content: response.text}]);
      
      console.log(messages)
    }
    await main();
  };

  return (
    <div className="relative">
      <div className="">
        <Sidebar/>
      </div>
      
      <div
        className="absolute p-0  w-full h-screen bg-repeat bg-auto -z-10"
        style={{ backgroundImage: "url('../bg-text.jpeg')" }}
      ></div>
      <div className="p-8 pl-16  w-full pb-32 h-[85vh] overflow-y-auto space-y-3   
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        {messages.map((msg) => {
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
        })}
        <div ref={bottomMessageRef}></div>
      

        <form onSubmit={sendPrompt} className=" ml-16 fixed bottom-4 ">
              <input
                type="text"
                name="message"
                placeholder="Type your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
  );
};

export default AiChatWindow;
