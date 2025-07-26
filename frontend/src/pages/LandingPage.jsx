
import { useNavigate } from "react-router-dom";
 
const LandingPage = () => {
  let navigate = useNavigate();
  return (
    <div className='p-4 relative flex flex-col items-center justify-start bg-[#FAECDC] min-h-screen min-w-screen'>
      <div><h1 className="absolute left-10 font-bold text-3xl">Chit Chat</h1></div>
      <div><img className=" object-contain mt-20  min-h-[40vh] min-w-[40vw] " src=".././connected-people-world.svg" alt="" /></div>
      <div><h1 className='md:text-5xl m-10 text-3xl text-center'><span className='text-[#F7B264]  font-serif'>Connect</span> <span className="font-serif">with your circle in a fun way</span></h1></div>
      <button onClick={()=>navigate("/home")} className="p-3 not-sm:p-2 not-sm:text-xl sm:text-2xl md:text-3xl text-white bg-[#F7B264] border-2 border-[#F7B264] hover:scale-[95%] hover:text-[#F7B264] hover:bg-white  transition-transform rounded-xl">Get Started</button>
    </div>
    // <div className="landingPageContainer">
    //   <nav>
    //     <div className="navHeader">
    //       <h2>Apna Video Call</h2>
    //     </div>
    //     <div className="navList ">
    //       <p>Join As Guest</p>
    //       <p>Register</p>
    //       <button>Login</button>
    //     </div>
    //   </nav>
    //   <div className="landingMainContainer ">
    //     <div className="content">
    //       <h1>
    //         <span style={{ color: "#FF9839" }}>Connect</span> with your loved
    //         ones
    //       </h1>

    //       <p>Cover a distance with Apna Video Call</p>
    //       <div role="button">
    //         <Link to={"/home"}>Get Started</Link>
    //       </div>
    //     </div>
    //     <div className="mobileImg">
    //       <img src="/mobile.png" alt="" />
    //     </div>

    //     <div className="clouds absolute">
    //       <div className="cloud1"></div>
    //       <div className="cloud2"></div>
    //       <div className="cloud3"></div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default LandingPage;
