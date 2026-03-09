
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"],
    },
    sender: {
        type: Types.ObjectId,
        ref: "UserSchema",
        required: true,
    },
    receiver: {
        type: Types.ObjectId,
        ref: "UserSchema",
        required: true,
    },
}, { timestamps : true});

export const RequestSchema = model("RequestSchema", schema);