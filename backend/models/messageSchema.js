
import { Schema, model, Types } from "mongoose";

const UserSubSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true, // still searchable by user ID
    },
    username: { type: String, required: true },
    name: { type: String },
    avatar: {
      public_id: String,
      url: String,
    },
  }, 
  { _id: false }
); // don't create extra _id for subdocument


const schema = new Schema({
    sender: {
        type: UserSubSchema,
        required: true,
    },
    receiver: {
        type: UserSubSchema,
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


// Indexes for query speed
schema.index({ 'sender._id': 1 });
schema.index({ 'receiver._id': 1 });
schema.index({ 'sender._id': 1, 'receiver._id': 1 }); // for $or queries

schema.index({ createdAt: -1 }); // for sorting
schema.index({ createdAt: -1, _id: -1 }); // for pagination performance



export const MessageSchema = model("MessageSchema", schema);