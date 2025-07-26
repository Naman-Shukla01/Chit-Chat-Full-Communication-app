import Group from "../models/group.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const joinGroup = async (req, res) => {
  let { userId, name: groupId, password } = req.body;
  console.log("group", groupId);
  let group = await Group.findById(groupId);
  let user = await User.findById(userId);

  if (!group) return res.json({ error: "Group not found" });

  if (group.password !== password)
    return res.json({ error: "Invalid group password" });

  if (!user.groups.includes(group._id)) {
    user.groups.push(group._id);
    await user.save();
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);

    await group.save();
  }

  res.json({ success: true, group });
};

const createGroup = async (req, res) => {
  let { name, password, userId } = req.body;
  let user = await User.findById(userId);
  let newGroup = new Group({
    groupname: name,
    password: password,
    members: [userId],
  });
  user.groups.push(newGroup._id);
  await newGroup.save();
  await user.save();
  res.status(201).json(newGroup);
};

const allGroups = async (req, res) => {
  let token = req.headers.authorization;
  console.log(token);
  if (!token)
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id).populate("groups");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      userId: user._id,
      username: user.username,
      groups: user.groups,
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

const deleteGroup = async (req, res) => {
  let { groupId } = req.params;
  let authHeader = req.headers.authorization;
  let token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("");
    const group = await Group.findById(groupId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!group) {
      return res.status(404).json({ message: "Group not found" , group});
    }

    group.members = group.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await group.save();

    user.groups = user.groups.filter(
      (gId) => gId.toString() !== group._id.toString()
    );
    await user.save();

    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.json({
      message: "Can't delete group ERROR occured",
      error: err.message,
    });
  }
  let deletedGroup = await Group.findByIdAndDelete(groupId);
  return res.status(200).json(deletedGroup._id, deletedGroup.name);
};

const updateGroup = async (req, res) => {
  let { groupId, name, password } = req.body;

  let updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { groupname: name, password },
    { new: true }
  );
  return res
    .status(200)
    .json({
      message: "Group Updated Successfully",
      groupId: updatedGroup._id,
      groupname: updatedGroup.groupname,
    });
};

export { joinGroup, createGroup, allGroups, updateGroup, deleteGroup };
