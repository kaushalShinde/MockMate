
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "UserSchema",
        required: true,
    },
    notification: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "notification",
        enum: ["request", "notification", "alert"],
    },
    requestId: {
        type: Types.ObjectId,
        ref: "RequestSchema", 
    },
    status: {
        type: String,
        default: "unread",
        enum: ["read", "unread"],
    },
}, { timestamps : true});

export const NotificationSchema = model("NotificationSchema", schema);