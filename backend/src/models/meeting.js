import mongoose,{Schema} from "mongoose";

const meetingSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    meetingCode:{
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };