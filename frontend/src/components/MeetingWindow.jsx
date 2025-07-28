import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { HistoryContext } from "../contexts/HistoryContext";
import { v4 as uuidv4 } from "uuid";

const MeetingWindow = () => {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [buttonClicked, setButtonClicked] = useState(undefined);

  const { addToUserHistory } = useContext(HistoryContext);
  let handleJoinVideoCall = async (e) => {
    e.preventDefault();
    await addToUserHistory(meetingCode);
    console.log("Meeting Code:", meetingCode);
    navigate(`/${meetingCode}`);
    console.log("hi");
  };

  return (
    <div
      className="relative w-full 
     sm:ml-16 mx-4 bg-[#FAECDC]  min-h-[100vh] h-fit"
    >
      <div className=" flex items-center justify-between top-0 sticky bg-[#FAECDC] w-full p-4">
        <div className="flex items-center ">
          <h2 className="text-3xl not-sm:text-xl font-bold">Chit Chat</h2>
        </div>
        <div className="flex  " onClick={() => navigate("/history")}>
          <div className="flex space-x-3 items-center cursor-pointer justify-center">
            <img src="/history-icon.svg" className="h-4 w-4 font-bold" />
            <p className="font-bold">History</p>
          </div>
        </div>
      </div>

      <div className="min-h-[85vh] h-fit  w-full flex not-sm:flex-col-reverse not-sm:pb-40 items-center justify-around overflow-auto">
        <div className="w-2/5 not-sm:w-full not-sm:flex not-sm:flex-col items-center justify-center">
          <h2 className="m-4 font-semibold text-3xl not-sm:text-xl flex not-sm:text-center w-fit">
            Providing Quality Video Call like Quality Education
          </h2>

          <div className="grid grid-cols-2 not-sm:grid-cols-1 items-center justify-center">
            <div
              onClick={() => {
                setButtonClicked("new");
                setMeetingCode(uuidv4());
              }}
              className="flex items-center w-fit space-x-2 cursor-pointer m-4 bg-[#F7B264] min-w-fit rounded-lg p-2"
            >
              <img src="/plus-icon.svg" className="h-6 w-6" alt="" />
              <p className="text-lg font-bold">New Meeting</p>
            </div>
            <div
              onClick={() => setButtonClicked("join")}
              className="flex items-center w-fit space-x-2 cursor-pointer m-4 bg-[#F7B264] min-w-fit rounded-lg p-2"
            >
              <img src="/join-icon.svg" className="h-6 w-6" alt="" />
              <p className="text-lg font-bold">Join a Meeting</p>
            </div>
          </div>
        </div>
        <div className="min-h-fit min-w-fit not-sm:w-full flex not-sm:justify-center items-center">
          <img
            src="/Group-video.svg"
            alt=""
            className="h-fit w-[40vw] not-sm:w-[70vw]"
          />
        </div>
      </div>

      {buttonClicked === "join" ? (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center  ">
          <form
            className=" fixed p-8  flex flex-col bg-white z-10  mt-12  rounded-2xl"
            action=""
            onSubmit={handleJoinVideoCall}
          >
            <div className="flex flex-row justify-between w-full pb-8 items-center">
              <label htmlFor="" className="text-2xl font-bold text-center">
                Join Meeting
              </label>
              <div
                onClick={() => {
                  setButtonClicked(undefined);
                }}
              >
                <img className="font-extrabold" src="/cancel-icon.svg" alt="" />
              </div>
            </div>

            <input
              className="p-1.5 text-xl border-b-4 border-[#F7B264] rounded-lg bg-white mr-2"
              type="text"
              name="groupCode"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              required
              placeholder="Enter Meeting Code"
            />
            <br />

            <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-orange-400 border-2 border-orange-400 hover:scale-[95%] hover:text-orange-400 hover:bg-white  transition-transform rounded-xl">
              Join Meeting
            </button>
          </form>
        </div>
      ) : buttonClicked === "new" ? (
        <div className="fixed inset-0 bg-black/50 w-full h-full z-10 flex justify-center  ">
          <form
            className="fixed p-8  flex flex-col bg-white z-10  mt-12 not-sm:p-1 rounded-2xl"
            onSubmit={handleJoinVideoCall}
          >
            <div className="flex flex-row justify-between">
              <label htmlFor="" className="text-2xl font-bold text-center pb-8">
                New Meeting
              </label>
              <div
                onClick={() => {
                  setButtonClicked(undefined);
                }}
              >
                <img className="font-extrabold" src="/cancel-icon.svg" alt="" />
              </div>
            </div>

            <p className="border-b-2 border-orange-300 w-fit mb-4">
              Meeting Code:
            </p>
            <p className="p-1.5 text-sm w-fit border-b-4 border-orange-300 rounded-lg bg-white mr-2 flex items-center justify-between">
              {meetingCode}{" "}
              <img
                onClick={() => {
                  navigator.clipboard.writeText(meetingCode);
                }}
                src="/copy-icon.svg"
                className="p-2 w-8 h-8"
                alt=""
              />
            </p>

            <br />

            <button className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-orange-400 border-2 border-orange-400 hover:scale-[95%] hover:text-orange-400 hover:bg-white  transition-transform rounded-xl">
              Start Meeting
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default MeetingWindow;
