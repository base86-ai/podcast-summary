# Podcast Summarizer Backend


**Dual input**: paste a podcast URL (YouTube/most RSS MP3s) or upload MP3/WAV up to **60 MB**.


- Gumroad license check (pass `x-license-key` header or `license_key` in body)
- Whisper (`whisper-1`) for transcription
- GPT (`gpt-4o-mini` by default) for summary
- Built for free-tier deploys (Railway)


## Quick start
```bash
cp .env.example .env
# fill keys
npm i
npm run start