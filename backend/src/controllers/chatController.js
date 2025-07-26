import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const joinChat = async (req, res) => {
  let { receiverId } = req.body;

  let receiver = await User.findById(receiverId);

  if (!receiver) return res.json({ error: "User not found" });

  res.json({ success: true, receiver });
};

const createChat = async (req, res) => {
  console.log(req.body);
  let { username, senderId } = req.body;
  let user = await User.findOne({ username: username });

  let sender = await User.findById(senderId);

  if (!user) return res.json({ error: "User not found" });
  console.log(sender.contacts);
  if (!user.contacts.includes(sender._id)) {
    user.contacts.push(sender._id);
    await user.save();
  }
  if (!sender.contacts.includes(user._id)) {
    sender.contacts.push(user._id);
  } else {
    return res.status(400).json({ error: "User is already in your chats" });
  }

  await sender.save();
  res.status(201).json(user);
};

const allChats = async (req, res) => {
  let token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id).populate("contacts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      userId: user._id,
      username: user.username,
      contacts: user.contacts,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  let authHeader = req.headers.authorization;
  let token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token)
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    const receiver = await User.findById(chatId);

    if (!user && !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user)

    user.contacts = user.contacts.filter((id) => id.toString() !== chatId);
    receiver.contacts = receiver.contacts.filter((id) => id.toString() !== decoded.id);
    await user.save();
    await receiver.save();

    return res.status(200).json({ message: "Chat deleted successfully", contacts: user.contacts });
  } catch (err) {
    res.json({
      message: "Can't delete chat ERROR occured",
      error: err.message,
    });
  }
};


export { joinChat, createChat, allChats, deleteChat };
