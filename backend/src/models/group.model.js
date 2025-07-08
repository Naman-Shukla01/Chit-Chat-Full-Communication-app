import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import Message from "./message.model.js";

const groupSchema = new Schema({
    groupname: {
        required: true,
        type: String
    },
    password: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }], 
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
}, {
    timestamps: true
});

const Group = mongoose.model("Group", groupSchema);

export default Group;