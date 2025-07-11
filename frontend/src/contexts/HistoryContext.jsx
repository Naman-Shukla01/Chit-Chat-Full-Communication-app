import {
  Children,
  createContext,
  useContext,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import axios from "axios";

export const HistoryContext = createContext();

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/users",
});

export const HistoryProvider = ({ children }) => {
  const authContext = useContext(HistoryContext);

    const getHistoryOfUser = async () => {
        try {
            let res = await client.get("/get_all_history", {
            params:{
                token: localStorage.getItem("token")
            }
        })
        return res.data;
        } catch (err) {
            throw err;
        }
        
    }
    
    const addToUserHistory = async (meetingCode) => {
        try {
            let res = await client.post("/add_to_history", {

                token: localStorage.getItem("token"),
                meetingCode: meetingCode,
            })
        return res.data;
        } catch (err) {
            throw err;
        }
        
    }

    const data = {
        addToUserHistory, getHistoryOfUser
    }

    return <HistoryContext.Provider value={data}>{children}</HistoryContext.Provider>
}