import React from 'react'
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { HistoryContext } from "../contexts/HistoryContext";

const MeetingWindow = () => {
  
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const {addToUserHistory} = useContext(HistoryContext)
  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode)
    navigate(`/${meetingCode}`);
    console.log("hi")
  };

  return (
    <div className="w-full ml-20  m-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-center ">
          <h2 className="text-3xl font-bold">Apna Video Call</h2>
        </div>

        <div className="flex items-center ">
          <div className="flex align-middle m-4" onClick={()=>navigate("/history")}>
            {/* <IconButton>
              <RestoreIcon />
            </IconButton> */}
            <p>History</p>
          </div>

          <button
          
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            lOGOUT
          </button>
        </div>
      </div>
      <div className=" h-full w-full">
        <div className="flex items-center">
          <div className="">
            <h2 className="m-4 text-3xl">Providing Quality Video Call like Quality Education</h2>

            <div>
              <input onChange={(e)=>{setMeetingCode(e.target.value)}} type="text" className="border-2 border-gray-500 " />
              <button className='bg-orange-500' onClick={handleJoinVideoCall}>Join</button>
            </div>
          </div>
          
          
          <div>
            <img src="/logo3.png" alt="" />
            </div>        
        </div>
       
      </div>
    </div>
  );
}

export default MeetingWindow;