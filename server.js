// server.js

const express = require('express');
const cors = require('cors');
const { Communicate } = require('edge-tts-universal');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/**
 * POST /synthesize
 * Receives text, voice, and title from the frontend, processes it using Edge TTS, 
 * and returns the audio stream configured for download with the custom filename.
 */
app.post('/synthesize', async (req, res) => {
    try {
        const { text, voice, title } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Use the user's selected voice, or fall back to Aria if none provided
        const selectedVoice = voice || 'en-US-AriaNeural';
        const communicate = new Communicate(text, { voice: selectedVoice });

        // Collect audio chunks from the TTS stream
        const audioChunks = [];
        for await (const chunk of communicate.stream()) {
            if (chunk.type === 'audio' && chunk.data) {
                audioChunks.push(chunk.data);
            }
        }

        // Combine chunks into a single audio buffer
        const audioBuffer = Buffer.concat(audioChunks);

        // Sanitize or fallback the filename title
        const sanitizedTitle = (title ? title.replace(/[^a-z0-9-_]/gi, '_') : 'neural_voice_speech');
        const filename = `${sanitizedTitle}.mp3`;

        // Set headers so the browser treats it as a downloadable file with the correct filename
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
            'Content-Disposition': `attachment; filename="${filename}"`
        });
        
        res.send(audioBuffer);
    } catch (error) {
        console.error('TTS Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate speech' });
    }
});

// Start the local server
app.listen(PORT, () => {
    console.log(`TTS Local Server running at http://localhost:${PORT}`);
});