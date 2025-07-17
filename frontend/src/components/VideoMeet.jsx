import { useContext, useEffect, useRef, useState } from "react";
import "../styles/videoMeetComponent.css";
import { TextField, Button, IconButton, Badge } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import io from "socket.io-client";
import { href, useNavigate } from "react-router-dom";
import "../styles/videoMeetComponent.css";
import withAuth from "../utils/withAuth";
import { AuthProvider } from "../contexts/AuthContext";
import server from "../environment";

const server_url = server.prod;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoMeetComponent = () => {
  let navigate = useNavigate();

  let socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState();
  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newMessages, setNewMessages] = useState(0);

  let [askforUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  // if(isChrome )

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (videoPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPermissions();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          // Black Silence
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();

    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(
      document.createElement("canvas"),
      (width, height)
    );

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();

    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((err) => console.log(err));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (err) {}
    }
  };

  useEffect(() => {
    if (audio !== undefined && video !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data, sender, socketIdSender) => {
    console.log(sender, data);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href, username);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients, name) => {
        console.log(name)
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream , username: name}
                    : video
                );

                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInline: true,
                username: name,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence(...args)]);

            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (err) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((err) => console.log(err));
            });
          }
        }
      });
    });
  };
  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let handleScreen = () => {
    setScreen(!screen);
  };

  let sendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      socketRef.current.disconnect()

      tracks.forEach((track) => track.stop());
      navigate("/home");
    } catch (e) {
      console.log(e);
    }
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          // Black Silence
          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence(...args)]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);

  return (
    <div className="">
      {askforUsername === true ? (
        <div className="flex min-h-screen min-w-screen flex-col items-center justify-center">
          <div className=" ">
            <video
              className="w-xl not-sm:w-xs h-80 m-8 bg-black"
              ref={localVideoRef}
              autoPlay
              muted
            ></video>
          </div>
          <div>
            <h2>Enter into lobby</h2>
            <br />
            <TextField
              id="outlined-basic"
              label="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
            />
            <button
              className="p-1.5 not-sm:p-1 not-sm:text-xl text-2xl text-white bg-orange-400 border-2 border-orange-400 hover:scale-[95%] hover:text-orange-400 hover:bg-white  transition-transform rounded-xl"
              onClick={connect}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="meetVideoContainer ">
          {showModal ? (
            <div className="chatRoom bg-amber-50 not-sm:min-w-screen">
              <div className="chatContainer bg-amber-50 z-10 p-6">
                <div className="flex flex-row justify-between">
                  <label
                    htmlFor=""
                    className="text-2xl font-bold text-center pb-4"
                  >
                    Chats
                  </label>
                  <div onClick={() => setShowModal(!showModal)}>
                    <img
                      className="font-extrabold"
                      src="/cancel-icon.svg"
                      alt=""
                    />
                  </div>
                </div>

                <hr />
                <div className="chattingDisplay">
                  {console.log(messages)}
                  {messages.length > 0 ? (
                    messages.map((item, index) => {
                      return (
                        <div style={{ marginBottom: "20px" }} key={index}>
                          {console.log(item)}
                          <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                          <p>{item.data}</p>
                        </div>
                      );
                    })
                  ) : (
                    <p>No messages yet</p>
                  )}
                </div>
                <div className="chattingArea">
                  <form onSubmit={sendMessage} className="flex p-4 ">
                    <input
                      type="text"
                      name="message"
                      placeholder="Type your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="p-2 text-xl border-4 w-full border-orange-200 rounded-lg bg-white mr-2"
                    />
                    <button
                      type="submit"
                      className="text-xl bg-orange-400 text-white rounded px-4 py-2"
                    >
                      <img src="/sent-icon.svg" alt="" />
                    </button>{" "}
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="fixed bg-[#302d2d] ">
            <video
              className="userVideo w-[10vh] h-[20vh] absolute left-0 bottom-[10vh]"
              ref={localVideoRef}
              autoPlay
              muted
            ></video>
            <h2 className="text-white text-xl">{username}</h2>
            <div className="overflow-y-scroll flex-col min-w-screen h-[100vh] flex p-4  items-center justify-center">
              {/* <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[40vw] min-h-[25vw] h-full w-full"></div>
                <div className="bg-gray-900  max-w-[75vw] max-h-[75vh] m-4 min-w-[40vw] min-h-[25vh] h-full w-full"></div> */}
              {videos.map((video) => (
                <div key={video.socketId}>
                  <video
                    className="bg-gray-900 max-w-[75vw] max-h-[75vh] m-2 min-w-[20vw] min-h-[15vw]"
                    autoPlay
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                  ></video>

                  <h2 className="text-white text-xl flex justify-end">{video.username}</h2>
                </div>
              ))}
            </div>
            <div className=" fixed bg-[#302d2d]  bottom-0 w-[100vw] text-center">
              <IconButton onClick={handleVideo} style={{ color: "white" }}>
                {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>

              <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                <CallEndIcon />
              </IconButton>

              <IconButton onClick={handleAudio} style={{ color: "white" }}>
                {audio === true ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              {screenAvailable === true ? (
                <IconButton onClick={handleScreen} style={{ color: "white" }}>
                  {screen === true ? (
                    <ScreenShareIcon />
                  ) : (
                    <StopScreenShareIcon />
                  )}
                </IconButton>
              ) : (
                <></>
              )}

              <Badge
                onClick={() => setShowModal(!showModal)}
                badgeContent={newMessages}
                max={999}
                color="secondary"
              >
                <IconButton style={{ color: "white" }}>
                  <ChatIcon />
                </IconButton>
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(VideoMeetComponent);
