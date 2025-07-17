
import { Link } from "react-router-dom";
 
const LandingPage = () => {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Apna Video Call</h2>
        </div>
        <div className="navList ">
          <p>Join As Guest</p>
          <p>Register</p>
          <button>Login</button>
        </div>
      </nav>
      <div className="landingMainContainer ">
        <div className="content">
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your loved
            ones
          </h1>

          <p>Cover a distance with Apna Video Call</p>
          <div role="button">
            <Link to={"/home"}>Get Started</Link>
          </div>
        </div>
        <div className="mobileImg">
          <img src="/mobile.png" alt="" />
        </div>

        <div className="clouds -z-10 ">
          <div className="cloud1"></div>
          <div className="cloud2"></div>
          <div className="cloud3"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
