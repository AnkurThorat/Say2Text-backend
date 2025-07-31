import mongoose from "mongoose";

const { Schema } = mongoose;

const transcriptionSchema = new Schema(
  {
    originalFileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: String, required: true },     
    transcript: { type: String, required: true }, 
    provider: { type: String, default: "assemblyai" },
  },
  { timestamps: true }
);

export default mongoose.model("Transcription", transcriptionSchema);
