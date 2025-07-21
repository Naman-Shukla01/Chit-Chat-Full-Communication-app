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
      allowedHeaders: ['*'],
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    //Chat
    socket.on("join-group", async ({groupId, password})=>{
        let allMessage = await Message.find({group: groupId}).populate("sender","username")
        socket.join(groupId);
        socket.emit("receive-message", allMessage)
    })

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
        console.error("Error joining chat:", error);
    }
});


    socket.on("send-message", async ({sender, message, groupId})=>{
        let newMessage = new Message({sender: sender, group: groupId, content: message})
        await newMessage.save();
        await newMessage.populate("sender")
       
        io.to(groupId).emit("receive-message", newMessage);
    })
    

    socket.on("send-personal-message", async ({sender, message, receiver})=>{
        let newMessage = new Message({sender: sender, receiver: receiver, content: message})
        console.log(sender, receiver)
        await newMessage.save();
        await newMessage.populate("sender")
        
         const roomId = [sender, receiver].sort().join("-"); 
        socket.join(roomId);
        io.to(roomId).emit("receive-message", newMessage);
    })


    //Meeting
    socket.on("join-call", (path, username) => {
      // socket.join(path);
      
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push({"socketId":socket.id, "name": username});
      console.log("connections: ", connections);
      timeOnline[socket.id] = new Date();

      connections[path].forEach((element) => {
        // if (element !== socket.id) {
    io.to(element).emit("user-joined", socket.id, connections[path]);
  // } 

      });

      if (messages[path] !== undefined) {
        messages[path].forEach((element) => {
          io.to(socket.id).emit(
            "chat-message",
            element["data"],
            element["sender"],
            element["socket-id-sender"] //because senders can have common name but socket id would be different for all of them
          );
        });
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false]
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message: ",matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((element) => {
          io.to(element).emit("chat-message", data, sender, socket.id);
        });
      }
    });
    socket.on("disconnect", () => {
      let diffTime = Math.abs(timeOnline[socket.id] - new Date());

      let key;

      for (const [room, persons] of Object.entries(connections)) {
  const found = persons.find((p) => p.socketId === socket.id);

  if (found) {
    // Notify all others in the room
    persons.forEach((participant) => {
      if (participant.socketId !== socket.id) {
        io.to(participant.socketId).emit("user-left", socket.id);
      }
    });

    // Remove the disconnected user
    connections[room] = persons.filter((p) => p.socketId !== socket.id);

    // Delete room if empty
    if (connections[room].length === 0) {
      delete connections[room];
    }

    console.log("User disconnected from room:", room);
    break; // Exit loop after cleanup
  }
}

    });
  });

  return io;
};
