
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    users: [{
        type: Types.ObjectId,
        ref: "UserSchema",
        required: true,
    }],
    lastMessage: {
        type: Types.ObjectId,
        ref: "MessageSchema",
        default: null,
    }
}, { timestamps : true});


export const ChatSchema = model("ChatSchema", schema);