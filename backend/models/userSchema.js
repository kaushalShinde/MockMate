
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
        index: true,
    },
    password: {
        type: String,
        required: true,
        // select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true,
      trim: true,      // removes whitespace
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    bio: {
        type: String,
        // required: true,
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
        index: true,
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


// compound index (optional)
schema.index({ username: 1, email: 1 });

export const UserSchema = model("UserSchema", schema);