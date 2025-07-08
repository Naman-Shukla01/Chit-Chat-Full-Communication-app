import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { HistoryContext } from "../contexts/HistoryContext";
import Card from "@mui/material/Card"
import withAuth from "../utils/withAuth";

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

  return (
    <div>
         {meetings.length===0 && <p>Loading</p>}
      {meetings.length>0 ?
        meetings.map(meeting => {
          return <div>
         <p className="">{meeting.date}</p>
            <Card variant="outlined"></Card>
          </div>
        })
      :<></>}

    </div>
  )
}

export default withAuth(History)