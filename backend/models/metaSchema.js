import mongoose from "mongoose";

const metaSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: Number, default: 0 },
});

metaSchema.index({ key: 1 }, { unique: true })

const Meta = mongoose.model("Meta", metaSchema);

export default Meta;
