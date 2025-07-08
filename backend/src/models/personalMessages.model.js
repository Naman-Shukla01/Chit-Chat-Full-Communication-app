import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import Group from "./group.model.js";

const personalMessageSchema = new Schema({
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
    sentAt: {
        type: Date,
        default : Date.now(),
    }
});

const PersonalMessage = mongoose.model("PersonalMessage", personalMessageSchema);

export default PersonalMessage;