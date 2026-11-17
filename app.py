import io
import re
from flask import Flask, request, send_file, jsonify, send_from_directory
from flask_cors import CORS
from gtts import gTTS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/synthesize', methods=['POST'])
def synthesize():
    try:
        data = request.get_json(silent=True) or {}
        text = (data.get('text') or '').strip()
        lang_raw = (data.get('lang') or 'en').strip()
        tld = (data.get('tld') or 'com').strip()
        title = (data.get('title') or '').strip()

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        # Map regional English codes (en-US, en-GB, en-IN, en-AU) to gTTS base 'en'
        lang = 'en' if lang_raw.startswith('en-') else lang_raw

        tts = gTTS(text=text, lang=lang, tld=tld)
        mp3_fp = io.BytesIO()
        tts.write_to_fp(mp3_fp)
        mp3_fp.seek(0)

        sanitized_title = re.sub(r'[^a-zA-Z0-9-_]', '_', title) if title else 'neural_voice_speech'
        filename = f"{sanitized_title}.mp3"

        return send_file(
            mp3_fp,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        print(f"TTS Generation Error: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("Neural Voice Artists Python Server running at http://localhost:3000")
    app.run(host='0.0.0.0', port=3000, debug=False)