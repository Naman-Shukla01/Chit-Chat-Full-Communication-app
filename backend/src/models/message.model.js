import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import Group from "./group.model.js";

const messageSchema = new Schema({
    content: {
        required: true,
        type: String
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: "Group"
    }, 
    sentAt: {
        type: Date,
        default : Date.now(),
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;