import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./server/src/config/db.js";
import transcriptionRoutes from "./server/src/routes/transcription.routes.js";

const app = express();

app.use(cors({ origin: "*" })); // This allows all origins
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", transcriptionRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});
