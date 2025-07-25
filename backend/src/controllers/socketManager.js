import { Server } from "socket.io"
import Message from "../models/message.model.js";

let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    io.on("connection", (socket) => {

        console.log("SOMETHING CONNECTED")

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

        socket.on("join-call", (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // connections[path].forEach(elem => {
            //     io.to(elem)
            // })

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        socket.on("disconnect", () => {

            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        connections[key].splice(index, 1)


                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }

            }


        })


    })


    return io;
}
