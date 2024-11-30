import express from 'express';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 3000;

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY, // Corrected environment variable name
});
const speechFile = path.resolve("./speech.mp3");

app.use(express.json());
app.use(cors());

app.post('/api/openai', async (req, res) => {
  console.log('Received a request at /api/openai');
  console.log('Request Body:', req.body); // Log the request body
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: "ladyboy killer 999999",
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Convert buffer to base64
    const audioBase64 = buffer.toString('base64');

    res.json({ 
      message: 'Speech file created successfully', 
      filePath: speechFile,
      audio: audioBase64 // Send audio as base64
    });
  } catch (error) {
    console.error('Error in /api/openai:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});

import fetch from 'node-fetch'; // Use ES6 import syntax

async function testServerConnection() {
  try {
    const response = await fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputText: 'Test input' }), // Provide valid input
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server Response:', data);
  } catch (error) {
    console.error('Error connecting to server:', error);
  }
}

testServerConnection();