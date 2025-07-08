import dotenv from "dotenv";

import express from "express";
import {createServer} from "node:http";

import mongoose from "mongoose";

import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js"
import groupRoutes from "./routes/groupRoutes.js"

dotenv.config();
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use(cors());
app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit: "40kb", extended: true}));

app.use("/api/v1/users", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/chat", chatRoutes);

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log(`Connected to DB`);
})
.catch((err)=>{
    console.log(`Can't connect to DB ${err}`)
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set('port', (process.env.PORT || 3000));




const start = async ()=> {
    server.listen(app.get("port"), ()=> {
    console.log("Listening to port 3000");
});
}

start();