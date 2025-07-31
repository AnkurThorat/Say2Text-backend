import axios from "axios";

const ASSEMBLY_API_KEY = process.env.ASSEMBLYAI_API_KEY;

export const transcribeWithAssembly = async (audioBuffer) => {
  if (!ASSEMBLY_API_KEY) {
    throw new Error("ASSEMBLYAI_API_KEY is missing in .env");
  }

  // 1) Upload raw bytes
  const uploadResponse = await axios.post(
    "https://api.assemblyai.com/v2/upload",
    audioBuffer,
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  const audioUrl = uploadResponse.data.upload_url;

  // 2) Create transcript job
  const transcriptResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    { audio_url: audioUrl },
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  const transcriptId = transcriptResponse.data.id;

  // 3) Poll until done
  while (true) {
    const pollingResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: { authorization: ASSEMBLY_API_KEY },
      }
    );

    if (pollingResponse.data.status === "completed") {
      return pollingResponse.data.text || "";
    }

    if (pollingResponse.data.status === "error") {
      throw new Error(pollingResponse.data.error || "AssemblyAI failed");
    }

    await new Promise((r) => setTimeout(r, 3000));
  }
};
