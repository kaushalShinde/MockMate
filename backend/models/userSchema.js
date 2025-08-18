
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // select: false,
    },
    bio: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
    },
    designation: {
        type: String,
    },
    posts: [{
        type: Types.ObjectId,
        ref: "PostSchema",
    }],
    lastActive: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
}, { timestamps : true});


export const UserSchema = model("UserSchema", schema);