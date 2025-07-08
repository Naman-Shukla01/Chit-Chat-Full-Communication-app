import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const joinChat = async (req, res) => {
    let { receiverId } = req.body;

    let receiver  = await User.findById(receiverId);

    if(!receiver) return res.json({error: "User not found"});
      
    res.json({ success: true,  receiver});
}

const createChat = async (req, res) => {
    let {username, senderId} = req.body;
    let user = await User.findOne({username: username});
    
    let sender = await User.findById(senderId);
    
    if(!user) return res.json({error: "User not found"});
    console.log(sender.contacts)
    if(!user.contacts.includes(sender._id)) {
      user.contacts.push(sender._id);
          await user.save();
    }
    if(!sender.contacts.includes(user._id)){
        sender.contacts.push(user._id);
        
    } else {
        return res.status(400).json({error: "User is already in your chats"});
    }

    
    
    await sender.save();
    res.status(201).json(user);
}

const allChats = async (req, res) => {
  
    let token = req.headers.authorization;
    console.log(token)
    if(!token) return res.status(401).json({ isAuthenticated: false, message: "No token provided" });
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded)
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
}

const deletechat = async (req, res) => {
  let { chatId } = req.body;

  let deletedchat = await User.findByIdAndDelete(chatId);
  return res.status(200).json(deletedchat._id, deletedchat.name);
}

const updatechat = async (req, res) => {
  let { chatId, name, password } = req.body;

  let updatedchat = await chat.findByIdAndUpdate(chatId, {chatname: name, password},{new: true});
  return res.status(200).json({message: "Group Updated Successfully", chatId: updatedchat._id,groupname: updatedGroup.groupname});

}

export {joinChat, createChat, allChats}