import Sidebar from "../components/Sidebar";
import MeetingWindow from "../components/MeetingWindow";
import ProfilePage from "./ProfilePage";

const MeetingPage = ({ showProfile, setShowProfile }) => {
  return (
    <div className="flex bg-[#FAECDC] min-h-screen">
      <Sidebar showProfile={showProfile} setShowProfile={setShowProfile} />

      {showProfile && <ProfilePage />}

      <MeetingWindow />
    </div>
  );
};

export default MeetingPage;
