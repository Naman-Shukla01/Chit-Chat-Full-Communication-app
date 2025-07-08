import mongoose, { Schema } from "mongoose";
import Group from "./group.model.js";
import PersonalMessage from "./personalMessages.model.js";

const userSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    username: {
        reuired: true,
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: "Group"
    }],
    contacts: [{
         type: Schema.Types.ObjectId,
        ref: "User",
    }],
    personalMessage : 
        [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    token: {
         type: String,
    }
    
});

const User = mongoose.model("User", userSchema);

export default User;