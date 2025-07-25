import { useState,useContext } from "react";
import server from "../environment";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AuthPage = () => {
  const [loginIsOpen, setLoginIsOpen] = useState(false);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [error, setError] = useState();
  const [message, setMessage] = useState();
  const navigate = useNavigate();

  const { handleRegister, handleLogin, userData, setUserData } = useContext(AuthContext);

  if(userData) {
    navigate("/home");
  }

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      let result = await handleRegister(name, username, password);
      console.log(result);
      setUsername("");
      setMessage(result);
      setError("");
      setPassword("");
      loginIsOpen(true);
      
    } catch (error) {
      console.log(error);
      let message = error.response?.data.message || error.message;
      setError(message);
    }

  };
  const handleSignin = async (e) => {
    try {
      e.preventDefault();
      await handleLogin(username, password);
     
      
    } catch (error) {
      console.log(error);
      let message = error.response.data?.message || error.message;
      setError(message);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#FAECDC] p-4">
      <div className="h-[80vh]  shadow-xl/20 m-6 not-sm:shadow-lg not-sm:m-0 not-sm:h-[70vh]  bg-white overflow-hidden drop-shadow-gray-800 rounded-lg p-6 not-sm:p-1 not-sm:grid-cols-1 grid grid-cols-2 items-center justify-center ">
        <div className="items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl not-sm:text-2xl py-4 not-sm:p-1">
              Welcome!
            </h1>
            <div className="py-4 space-x-4 not-sm:p-1">
              <button
                className={
                  loginIsOpen
                    ? "underline decoration-[#F7B264] not-sm:text-xl sm:text-3xl"
                    : " not-sm:text-xl sm:text-3xl"
                }
                onClick={() => {
                  setLoginIsOpen(true);
                }}
              >
                Login
              </button>
              <button
                className={
                  !loginIsOpen
                    ? "underline decoration-[#F7B264] not-sm:text-xl sm:text-3xl"
                    : "not-sm:text-xl sm:text-3xl"
                }
                onClick={() => {
                  setLoginIsOpen(false);
                }}
              >
                Signup
              </button>
            </div>

            <div className="text-center">
              {loginIsOpen ? (
                <form
                  className="space-y-2 "
                  method="POST"
                  onSubmit={handleSignin}
                >
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="text-sm p-1 border-2 rounded-lg border-gray-300"
                    name="username"
                    required
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                  <br />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="text-sm p-1 rounded-lg border-2 border-gray-300"
                    name="password"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <br />
                  <p className="text-red-500 font-bold">{error}</p> <br />
                  <button
                    type="submit"
                    className=" px-4 py-2  font-semibold text-lg text-white bg-[#F7B264] border-2 border-[#F7B264] hover:scale-[95%] hover:text-[#F7B264] hover:bg-white  transition-transform rounded-xl"
                  >
                    Login
                  </button>
                </form>
              ) : (
                <form
                  className="space-y-2.5"
                  method="POST"
                  onSubmit={handleSignup}
                >
                  <input
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    className="text-sm p-1 rounded-lg border-2 border-gray-300"
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                  />
                  <br />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="text-sm p-1 rounded-lg border-2 border-gray-300"
                    name="username"
                    required
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                  <br />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    className="text-sm p-1 rounded-lg border-2 border-gray-300"
                    required
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <br />{" "} 
                    <p className="text-red-500 font-bold">{error}</p>
                    <br />
                  <button
                    type="submit"
                    className=" px-4 py-2 font-semibold text-lg text-white bg-[#F7B264] border-2 border-[#F7B264] hover:scale-[95%] hover:text-[#F7B264] hover:bg-white  transition-transform rounded-xl"
                  >
                    Signup
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div>
          <img
            src=".././auth.svg"
            alt=""
            className="not-sm:hidden h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
