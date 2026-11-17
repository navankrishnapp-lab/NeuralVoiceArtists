`   # Neural Voice Artists
An accessible, instant text-to-speech studio built with multi-language voice synthesis, crafted specifically for blind and visually impaired students and researchers.

## Overview
Many students and researchers who are blind or visually impaired rely on turning digital notes and study materials into natural audio. Existing tools often present serious hurdles:
* Imposing strict character paywalls or download limits.
* Requiring cumbersome workflows where text must be moved across multiple apps.
* Failing during large synthesis tasks.
* Interfaces that are inaccessible or broken for screen reader users (NVDA, JAWS, VoiceOver, TalkBack).

**Neural Voice Artists** solves this by providing a local, completely free, and unrestricted text-to-speech desktop studio. It is designed from the ground up for seamless screen reader Focus Mode and Browse Mode navigation, full keyboard control, and instant audio generation without licensing fees or usage caps.

## Key Features
* **Built for Screen Readers (NVDA Focus & Browse Mode):** Includes native semantic controls, skip-navigation links, ARIA live status announcements, explicit form labeling, and high-visibility keyboard focus indicators.
* **Full Keyboard Navigation:** Native dropdown selection, shortcut-friendly controls, and clean tab order across the entire interface without layout clutter.
* **Multi-Language & Regional Support:** Supports English (US, UK, India, Australia) alongside Indian and international languages including Malayalam, Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, French, Spanish, German, Arabic, Japanese, Korean, and Chinese powered by Google Text-to-Speech (`gTTS`).
* **No Character Limits or Subscriptions:** Handles large study notes and texts up to 500,000 characters per run with live character and word counting.
* **Smart Playback & MP3 Export:** Features optional Auto-play upon generation, a **Read Along** replay button for instant listening, and one-click `.mp3` export with custom file naming.
* **High-Contrast Dark Theme:** Pitch-black (`#000000`) background with glowing neon cyan (`#00d2ff`) accents and a clean borderless workspace for low visual fatigue.
* **Zero-Config Windows Auto-Launcher:** Double-clicking `launch.bat` automatically checks for Python 3, installs Python and required libraries (`Flask`, `Flask-CORS`, `gTTS`) if missing, starts the local backend, and opens the studio in your default browser.

## Tech Stack
* **Frontend:** Single-file semantic HTML5, CSS3 (pitch-black `#000000` and neon cyan `#00d2ff` theme), and Vanilla JavaScript (ES6+).
* **Backend:** Python 3 with Flask and Flask-CORS.
* **TTS Engine:** `gTTS` (Google Text-to-Speech) for multi-language `.mp3` audio synthesis.
* **Launcher:** Windows batch script (`launch.bat`) with automatic Python and dependency installation.

## Project Structure
```text
NeuralVoiceArtists/
├── index.html     # All-in-one accessible frontend (HTML, CSS, and JavaScript)
├── app.py         # Python Flask backend handling gTTS synthesis and MP3 streaming
├── launch.bat     # One-click Windows auto-installer and launcher script
├── aicore.mp4     # Animated AI core emblem for the top-left header
└── README.md      # Project documentation      