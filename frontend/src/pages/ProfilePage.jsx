import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ProfilePage = () => {
  const { userData } = useContext(AuthContext);
  return (
    <div className="fixed not-sm:inset-0 not-sm:mb-4 bottom-0 left-12 sm:h-2/3 sm:w-1/3 bg-[#Fff] rounded-xl drop-shadow-lg sm:p-4 sm:m-4">
      <div className=""></div>

      <div className="flex justify-between">
        <div>
          Name: <input type="text" value={userData.name} />
        </div>{" "}
        <div>
          <img className="h-4 w-auto" src="/edit-icon.svg" alt="" />
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          Username: <input type="text" value={userData.username} />
        </div>{" "}
        <div>
          <img className="h-4 w-auto" src="/edit-icon.svg" alt="" />
        </div>{" "}
      </div>
    </div>
  );
};

export default ProfilePage;
