import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import axios from "axios";
import server from "../environment";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const navigate = useNavigate();

        const isAuthenticated = async () => {
            let token = localStorage.getItem("token");
            try {
                if(token) {
                let result = await axios.get(`${server.dev}/api/v1/users/login`, {
                     params:{token} 
            })
        }
            } catch (error) {
                console.error("Authentication error:", error);
                localStorage.removeItem("token");
                return false;
            }
            
            
        }

        useEffect(()=> {
            if(!isAuthenticated()){
                navigate("/auth")
            }
        }, [])

        return <WrappedComponent {...props}/>
    }
    return AuthComponent;
}

export default withAuth;