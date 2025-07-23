import { Server } from "socket.io";
import Message from "../models/message.model.js";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Group chat
    socket.on("join-group", async ({ groupId, password }) => {
      try {
        const allMessages = await Message.find({ group: groupId }).populate("sender", "username");
        socket.join(groupId);
        socket.emit("receive-message", allMessages);
      } catch (err) {
        console.error("join-group error:", err);
      }
    });

    // One-on-one chat
    socket.on("join-chat", async ({ senderId, receiverId }) => {
      try {
        const sentMessages = await Message.find({ sender: senderId, receiver: receiverId })
          .populate("receiver", "username")
          .populate("sender", "username");

        const receivedMessages = await Message.find({ sender: receiverId, receiver: senderId })
          .populate("sender", "username")
          .populate("receiver", "username");

        const allMessages = [...sentMessages, ...receivedMessages];
        allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

        const roomId = [senderId, receiverId].sort().join("-");
        socket.join(roomId);
        socket.emit("receive-message", allMessages);
      } catch (error) {
        console.error("join-chat error:", error);
      }
    });

    // Group message
    socket.on("send-message", async ({ sender, message, groupId }) => {
      try {
        const newMessage = new Message({ sender, group: groupId, content: message });
        await newMessage.save();
        await newMessage.populate("sender");

        io.to(groupId).emit("receive-message", newMessage);
      } catch (err) {
        console.error("send-message error:", err);
      }
    });

    // Private message
    socket.on("send-personal-message", async ({ sender, message, receiver }) => {
      try {
        const newMessage = new Message({ sender, receiver, content: message });
        await newMessage.save();
        await newMessage.populate("sender");

        const roomId = [sender, receiver].sort().join("-");

        // Avoid rejoining if already in room
        const rooms = Array.from(socket.rooms || []);
        if (!rooms.includes(roomId)) {
          socket.join(roomId);
        }

        io.to(roomId).emit("receive-message", newMessage);
      } catch (err) {
        console.error("send-personal-message error:", err);
      }
    });

    // Video meeting (call)
    socket.on("join-call", (path, username) => {
      if (!connections[path]) {
        connections[path] = [];
      }

      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      connections[path].forEach((id) => {
        io.to(id).emit("user-joined", socket.id, connections[path], username);
      });

      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg["data"],
            msg["sender"],
            msg["socket-id-sender"]
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      let roomKey = "";
      for (const [room, participants] of Object.entries(connections)) {
        if (participants.includes(socket.id)) {
          roomKey = room;
          break;
        }
      }

      if (roomKey) {
        if (!messages[roomKey]) {
          messages[roomKey] = [];
        }

        messages[roomKey].push({
          sender,
          data,
          "socket-id-sender": socket.id,
        });

        connections[roomKey].forEach((id) => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      let key;

      for (const [room, participants] of Object.entries(connections)) {
        const index = participants.indexOf(socket.id);
        if (index !== -1) {
          key = room;

          // Notify other users
          connections[room].forEach((participantId) => {
            if (participantId !== socket.id) {
              io.to(participantId).emit("user-left", socket.id);
            }
          });

          // Remove the disconnected user
          connections[room].splice(index, 1);

          if (connections[room].length === 0) {
            delete connections[room];
          }

          break;
        }
      }

      delete timeOnline[socket.id];
    });
  });

  return io;
};
