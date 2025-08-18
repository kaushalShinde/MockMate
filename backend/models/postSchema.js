
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
    creator: {
        type: Types.ObjectId,
        ref: "UserSchema",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    likes: [{
        type: Types.ObjectId,
        ref: "UserSchema",
    }],
    dislikes:[{
        type: Types.ObjectId,
        ref: "UserSchema",
    }]
}, { timestamps : true});


export const PostSchema = model("PostSchema", schema);