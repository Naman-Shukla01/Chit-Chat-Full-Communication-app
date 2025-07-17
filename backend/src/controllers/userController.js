import httpStatus from "http-status";
import User from "../models/user.model.js";
import { Meeting } from "../models/meeting.js";
import bcrypt, { hash } from "bcrypt";
import  jwt  from "jsonwebtoken";

const getUserData = async (req, res) => {
  try {
    let { token } = req.query;
console.log(token)
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found." });
    }
console.log(":",process.env.JWT_SECRET)
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(decoded.id === user._id.toString()){
        return res.status(httpStatus.OK).json({ token: token, _id: user._id, name: user.name, username: user.username });
      }
    } 
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Token not Valid." });
    

    
  } catch (err) {
    res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const signup = async (req, res) => {
  try {
    let { username, name, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username,
      name: name,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(httpStatus.CREATED).json({ message: "User registered." });
  } catch (err) {
    res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const login = async (req, res) => {
  try {
    let { username, password, token } = req.body;


    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User not found." });
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(token)
      if(decoded._id === user._id){
        return res.status(httpStatus.OK).json({ token: token, name: user.name, username: username });
      }
    }
    
    let validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: `Something went wrong ${err}` });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });
    const meetings = await Meeting.find({ user_id: user.username });

    res.json(meetings);
    console.log(user, meetings);
  } catch (err) {
    res.json({ message: "Something went wrong ERROR:", err });
  }
};

const addToHistory = async (req, res) => {
  const { token, meetingCode } = req.body;

  try {
    const user = await User.findOne({ token: token });
    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meetingCode,
    });

    await newMeeting.save();
    console.log(token, meetingCode);
    res
      .status(httpStatus.CREATED)
      .json({ message: "Added to History successfully" });
  } catch (err) {
    res.json({ message: "Something went wrong ERROR:", err });
  }
};

export { signup, login, getUserData, getUserHistory, addToHistory };
