import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(".")); // Serve index.html, style.css, script.js

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageBase64 = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    if (imageBase64) {
      res.json({ imageBase64 });
    } else {
      res.status(500).json({ error: "No image data returned." });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating image." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
