
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


schema.index({ users: 1 }); // speeds up lookups by user
schema.index({ updatedAt: -1 }); // improves sorting by latest updates
schema.index({ lastMessage: 1 }); // faster lookup for populated lastMessage

export const ChatSchema = model("ChatSchema", schema);