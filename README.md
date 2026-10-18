Neural Voice Artists
An accessible, instant text to speech studio built with natural neural voices, crafted specifically for blind and visually impaired students and researchers.
Overview
Many students and researchers who are blind or visually impaired rely on turning digital notes and study materials into natural audio. Existing tools often present serious hurdles.
Imposing strict character paywalls or download limits.
Requiring cumbersome workflows where text must be moved across multiple apps.
Failing during large synthesis tasks.
Interfaces that are inaccessible or broken for screen reader users NVDA, JAWS, VoiceOver.
Neural Voice Artists solves this by providing a local, completely free, and unrestricted text to speech desktop interface. It is designed from the ground up for high screen reader accessibility, keyboard navigation, and instant natural audio generation without licensing fees or usage caps.
Key Features
Built for Screen Readers. Includes ARIA compliant custom controls, live status regions, listbox and option roles, explicit semantic labeling, and clear keyboard focus indicators.
Full Keyboard Navigation. Full arrow key selection, Enter and Space activation, and Escape handling across the interface.
Natural AI Neural Voices. High quality regional neural voices from the US, UK, Australia, and India powered by Edge TTS.
No Character Limits or Subscriptions. Handles large study notes and texts up to 500000 characters per run.
Instant Local Playback and MP3 Export. Features automatic playback upon synthesis and direct one click export with custom file naming.
High Contrast Dark Theme. Low visual fatigue, high contrast black and cyan aesthetic with clear layout boundaries.
Tech Stack
Frontend. Semantic HTML5, CSS3 with high contrast cyberpunk and minimalist dark mode styling, and Vanilla JavaScript ES6 plus.
Backend. Node.js and Express.js.
TTS Engine. edge-tts-universal for Microsoft Edge Neural Voice synthesis.
Launcher. Windows batch script for one click startup.
Project Structure
Neural Voice Artists
index.html for semantic screen reader friendly markup
style.css for high contrast styling and layout
script.js for frontend keyboard navigation, API calls, and audio playback
server.js for Express backend handling neural TTS streaming
launcher.bat for one click launch on Windows
install.txt for dependency installation reference
