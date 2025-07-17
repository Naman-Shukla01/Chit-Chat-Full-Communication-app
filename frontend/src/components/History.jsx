import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { HistoryContext } from "../contexts/HistoryContext";
import Card from "@mui/material/Card"
import withAuth from "../utils/withAuth";
import { format } from "date-fns";

const History = () => {

    const {getHistoryOfUser} = useContext(HistoryContext);

    const [meetings, setMeetings] = useState([]);

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchHistory = async ()=> {
            try{
                const history = await getHistoryOfUser();
                console.log(history)
                setMeetings(history);
            } catch (err) {
                
            }
        }
        fetchHistory();
    },[])

    console.log(meetings)

  return (
    <div className="bg-white min-h-screen  space-y-4 m-4 ">
      <div className="flex space-x-4 sticky top-0 bg-white z-10 p-4">

      <img src="/back-icon.svg" alt=""  className="h-8" onClick={()=> navigate("/meeting")}/>
      <p className="text-3xl font-bold h-8">History</p>
      </div>
         {meetings.length===0 && <p>Loading</p>}
      {meetings.length>0 ?
        meetings.map(meeting => {
          let date = format(new Date(meeting.date), "PPpp");
          return <div className="bg-[#FAECDC] rounded-2xl p-2">
         <p className=""><span className="font-semibold">Meeting code: </span> {meeting.meetingCode}</p>
          <p><span className="font-semibold">Hosted by:</span> {meeting.user_id}</p>
          <p><span className="font-semibold">Hosted on:</span> {date}</p>
          </div>
        })
      :<></>}

    </div>
  )
}

export default withAuth(History)