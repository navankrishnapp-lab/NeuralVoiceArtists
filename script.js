// script.js - Neural Voice Artist (Updated with Full Accessibility & Download Feature)

const availableVoices = [
    { name: "Aria", shortName: "en-US-AriaNeural", label: "Aria - English (Female, US)" },
    { name: "Guy", shortName: "en-US-GuyNeural", label: "Guy - English (Male, US)" },
    { name: "Jenny", shortName: "en-US-JennyNeural", label: "Jenny - English (Female, US)" },
    { name: "Steffan", shortName: "en-US-SteffanNeural", label: "Steffan - English (Male, US)" },
    { name: "Sonia", shortName: "en-GB-SoniaNeural", label: "Sonia - English (Female, UK)" },
    { name: "Ryan", shortName: "en-GB-RyanNeural", label: "Ryan - English (Male, UK)" },
    { name: "Natasha", shortName: "en-AU-NatashaNeural", label: "Natasha - English (Female, AU)" },
    { name: "William", shortName: "en-AU-WilliamNeural", label: "William - English (Male, AU)" },
    { name: "Neerja", shortName: "en-IN-NeerjaNeural", label: "Neerja - English (Female, IN)" },
    { name: "Prabhat", shortName: "en-IN-PrabhatNeural", label: "Prabhat - English (Male, IN)" }
];

document.addEventListener('DOMContentLoaded', () => {
    const customDropdown = document.getElementById('customDropdown');
    const dropdownSelected = document.getElementById('dropdownSelected');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownOptions = document.getElementById('dropdownOptions');
    const selectedVoiceValue = document.getElementById('selectedVoiceValue');
    
    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('charCount');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const autoplayCheckbox = document.getElementById('autoplayCheckbox');
    const audioPlayer = document.getElementById('audioPlayer');
    const fileTitle = document.getElementById('fileTitle');
    const srAnnouncer = document.getElementById('srAnnouncer');

    let currentAudioUrl = null;
    let lastGeneratedBlob = null; // Store blob for download

    function announce(message) {
        if (srAnnouncer) {
            srAnnouncer.textContent = message;
        }
    }

    function renderVoices(voicesToRender) {
        dropdownOptions.innerHTML = '';
        
        if (voicesToRender.length === 0) {
            const noResult = document.createElement('div');
            noResult.classList.add('dropdown-option', 'no-results');
            noResult.textContent = 'No voices found';
            noResult.style.color = '#888';
            dropdownOptions.appendChild(noResult);
            return;
        }

        voicesToRender.forEach((voice) => {
            const div = document.createElement('div');
            div.classList.add('dropdown-option');
            div.textContent = voice.label;
            div.setAttribute('role', 'option');
            div.tabIndex = 0;
            
            div.addEventListener('click', () => {
                dropdownSelected.textContent = voice.label;
                dropdownSelected.setAttribute('aria-expanded', 'false');
                selectedVoiceValue.value = voice.shortName;
                customDropdown.classList.remove('open');
                announce(`Selected voice: ${voice.label}`);
                dropdownSelected.focus();
            });

            div.addEventListener('keydown', (e) => {
                const options = Array.from(dropdownOptions.querySelectorAll('.dropdown-option'));
                const currentIndex = options.indexOf(div);

                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    div.click();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + options.length) % options.length;
                    options[prevIndex].focus();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    customDropdown.classList.remove('open');
                    dropdownSelected.setAttribute('aria-expanded', 'false');
                    dropdownSelected.focus();
                    announce('Voice selection menu closed');
                }
            });

            dropdownOptions.appendChild(div);
        });
    }

    if (availableVoices.length > 0) {
        selectedVoiceValue.value = availableVoices[0].shortName;
    }
    renderVoices(availableVoices);

    dropdownSelected.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = customDropdown.classList.toggle('open');
        dropdownSelected.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
            renderVoices(availableVoices);
            announce('Voice selection menu opened');
        } else {
            announce('Voice selection menu closed');
        }
    });

    dropdownSelected.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            const isOpen = customDropdown.classList.toggle('open');
            dropdownSelected.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                renderVoices(availableVoices);
                announce('Voice selection menu opened');
                const firstOption = dropdownOptions.querySelector('.dropdown-option');
                if (firstOption) {
                    firstOption.focus();
                }
            } else {
                announce('Voice selection menu closed');
            }
        } else if (e.key === 'Escape' && customDropdown.classList.contains('open')) {
            e.preventDefault();
            customDropdown.classList.remove('open');
            dropdownSelected.setAttribute('aria-expanded', 'false');
            announce('Voice selection menu closed');
        }
    });

    document.addEventListener('click', () => {
        if (customDropdown.classList.contains('open')) {
            customDropdown.classList.remove('open');
            dropdownSelected.setAttribute('aria-expanded', 'false');
        }
    });

    dropdownMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    textInput.addEventListener('input', () => {
        const length = textInput.value.length;
        charCount.textContent = `${length.toLocaleString()} / 500,000`;
    });

    generateBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();
        const voice = selectedVoiceValue.value;
        const title = fileTitle.value.trim();

        if (!text) {
            alert('Please enter some text to synthesize.');
            announce('Error: Please enter text to synthesize.');
            textInput.focus();
            return;
        }

        if (!voice) {
            alert('Please select a voice.');
            announce('Error: Please select a voice.');
            return;
        }

        try {
            generateBtn.textContent = 'Generating...';
            generateBtn.disabled = true;
            announce('Generating speech, please wait.');

            const endpoint = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:3000/synthesize' 
                : '/synthesize';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice, title }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to generate speech');
            }

            lastGeneratedBlob = await response.blob();
            
            if (currentAudioUrl) {
                URL.revokeObjectURL(currentAudioUrl);
            }
            
            currentAudioUrl = URL.createObjectURL(lastGeneratedBlob);

            audioPlayer.src = currentAudioUrl;
            audioPlayer.load();

            if (autoplayCheckbox.checked) {
                try {
                    await audioPlayer.play();
                    announce('Speech generated successfully and playing audio.');
                } catch (playError) {
                    console.warn('Autoplay blocked by browser:', playError);
                    announce('Speech generated successfully. Click play on the audio player.');
                }
            } else {
                announce('Speech generated successfully.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`An error occurred: ${error.message}`);
            announce('Error occurred while generating speech.');
        } finally {
            generateBtn.textContent = 'Generate Speech';
            generateBtn.disabled = false;
        }
    });

    // Download button functionality
    downloadBtn.addEventListener('click', () => {
        if (!lastGeneratedBlob) {
            alert('Please generate speech first before downloading.');
            announce('Error: No audio generated yet.');
            return;
        }

        const title = fileTitle.value.trim();
        const sanitizedTitle = title ? title.replace(/[^a-z0-9-_]/gi, '_') : 'neural_voice_speech';
        const filename = `${sanitizedTitle}.mp3`;

        const downloadUrl = URL.createObjectURL(lastGeneratedBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        announce(`Downloaded audio file as ${filename}`);
    });
});