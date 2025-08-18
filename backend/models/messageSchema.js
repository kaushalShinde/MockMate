
import { Schema, model, Types } from "mongoose";

const schema = new Schema({
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
    content: {
        type: String,
    },
    attachments: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        }
    ]
}, { timestamps : true});


export const MessageSchema = model("MessageSchema", schema);