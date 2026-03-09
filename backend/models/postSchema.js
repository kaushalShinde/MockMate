
import { Schema, model, Types } from "mongoose";

const creatorSubSchema = new Schema({
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true, // still searchable by creator ID
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
    creator: {
        type: creatorSubSchema,
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

// crucial index for feed performance
schema.index({ createdAt: -1 });

// for cursor pagination (createdAt + _id)
schema.index({ createdAt: -1, _id: -1 });

// if you ever query by creator + sort by date
schema.index({ "creator._id": 1, createdAt: -1 });

export const PostSchema = model("PostSchema", schema);