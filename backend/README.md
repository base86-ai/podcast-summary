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


Test


Health: GET /health


URL route:
curl -X POST http://localhost:3000/api/url \
-H 'Content-Type: application/json' \
-H 'x-license-key: GUMR-XXXX-YYYY' \
-d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'


Upload route:
curl -X POST http://localhost:3000/api/upload \
-H 'x-license-key: GUMR-XXXX-YYYY' \
-F 'audio=@/path/to/episode.mp3'


## Deploy (Railway + Nixpacks)

1. Ensure the repo has `backend/nixpacks.toml` (installs `yt-dlp` and `ffmpeg`).
2. Push to GitHub and connect the project in Railway.
3. In Railway, set the root directory to `backend/` and the start command to `npm start`.
4. Add environment variables (from `.env.example`):
   - `OPENAI_API_KEY`
   - `GUMROAD_PRODUCT_ID`
   - Optional: `OPENAI_TRANSCRIBE_MODEL`, `OPENAI_SUMMARIZE_MODEL`, `MAX_UPLOAD_MB`, `REQUEST_TIMEOUT_MS`, `PORT`
5. Deploy. After the first successful build, hit `GET /health` on the public URL.

Notes:
- `yt-dlp` and `ffmpeg` are provided by `nixpacks.toml`. No extra build steps needed.
- Upload size is capped by `MAX_UPLOAD_MB` (default 60).
- For URL ingestion, the instance must have network egress.

## Environment
Copy `.env.example` to `.env` and fill required keys. Common knobs:

- `OPENAI_API_KEY` (required)
- `GUMROAD_PRODUCT_ID` (required)
- `OPENAI_TRANSCRIBE_MODEL=whisper-1` (default)
- `OPENAI_SUMMARIZE_MODEL=gpt-4o-mini` (default)
- `MAX_UPLOAD_MB=60`
- `REQUEST_TIMEOUT_MS=180000`
- `PORT=3000`