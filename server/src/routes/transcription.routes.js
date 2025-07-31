import { Router } from "express";
import { upload } from "../utils/multer.js";
import { transcribe, list, remove } from "../controllers/transcription.controller.js";

const router = Router();

router.post("/transcribe", (req, res, next) => {
  upload.single("audio")(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, transcribe);

router.get("/transcriptions", list);
router.delete("/transcriptions/:id", remove);

export default router;
