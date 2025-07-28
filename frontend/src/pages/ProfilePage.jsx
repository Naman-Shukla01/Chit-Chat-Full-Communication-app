import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import server from "../environment";

const ProfilePage = () => {
  const { userData, setUserData } = useContext(AuthContext);
  const [canEdit, setCanEdit] = useState(false);
  const [username, setUsername] = useState(userData?.username);
  const [name, setName] = useState(userData?.name);

  const updateProfile = async () => {
    const res = await axios.put(`${server.prod}/api/v1/users`, {
      oldUsername: userData.username,
      newUsername:username, name, password: "123456789"
    })
    
    setUserData((prevdata)=>({...prevdata, username:res.data.username, name: res.data.name}))
    console.log(res)
  }

  return (
    <div className="fixed not-sm:inset-0 z-50 not-sm:mb-4 bottom-0 left-12 sm:h-2/3 sm:w-2/3 bg-[#Fff] rounded-xl drop-shadow-lg p-4 m-4">
      <h1 className="text-3xl text-center m-4 font-bold font-mono">
        Profile 
      </h1>
      <div className="flex space-x-2 flex-wrap">
        <h1 className="font-semibold text-xl">Name:</h1>{" "}
        <input
          className="text-xl w-1/2"
          readOnly={!canEdit}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>{" "}
      {/* <img className="h-4 w-4" src="/edit-icon.svg" alt="" /> */}
      <div className="flex space-x-2   flex-wrap">
        <h1 className="font-semibold text-xl">Username:</h1>{" "}
        <input
          className="text-xl max-w-fit"
          readOnly={!canEdit}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* <img className="h-4 w-4" src="/edit-icon.svg" alt="" />{" "} */}
      </div>
      <div className="flex justify-center items-center flex-col space-y-1 mt-10">
        <button
          className="flex items-center space-x-2 cursor-pointer m-4 font-semibold bg-[#F7B264] border border-[#F7B264] min-w-fit rounded-lg p-2 hover:scale-[90%]  hover:bg-white"
          onClick={() => {
            if(canEdit){
              updateProfile();
            }
            setCanEdit(true);
            
          }}
        >
          {!canEdit? "Update": "Save Updates"}
        </button>
        <p className="text-red-500 flex justify-center items-center text-lg hover:bg-gray-300 pr-2 rounded-lg ">
          <img
            className="cursor-pointer h-10 w-10"
            src="/logout-icon.svg"
            alt=""
            onClick={() => {
              localStorage.removeItem("token");
              setUserData(null);
              navigate("/");
            }}
          />
          Logout
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
