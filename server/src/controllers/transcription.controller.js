import Transcription from "../models/Transcription.js";
import { transcribeWithAssembly } from "../services/assembly.service.js";

export const transcribe = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file provided" });

    const transcript = await transcribeWithAssembly(req.file.buffer);
    const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + " MB";

    const doc = await Transcription.create({
      originalFileName: req.file.originalname,
      mimeType: req.file.mimetype || "application/octet-stream",
      size: sizeInMB,
      transcript,
    });

    return res.status(201).json(doc);
  } catch (error) {
    console.error("Transcription Error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const list = async (req, res) => {
  try {
    const docs = await Transcription.find().sort({ createdAt: -1 });
    return res.json(docs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Transcription.findByIdAndDelete(id);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: "Invalid id" });
  }
};
