## 4) docs/technical_overview.md


```md
# Technical Overview — Podcast Summarizer MVP


## Goal
Convert podcast audio (URL or upload) into high-quality show notes using OpenAI Whisper for transcription and GPT for summarization.


## Architecture
- **Frontend**: Next.js (v0.app generated), minimal single-page UI.
- **Backend**: Node.js + Express on Railway.
- **AI**: OpenAI `whisper-1` for STT, `gpt-4o-mini` for summary (cheap, fast defaults).
- **Storage**: None persistent. Temp files on disk, deleted after request.
- **Payments**: Gumroad license verification as a paywall (no accounts needed).


## Request Flow
1. Client sends either a URL or an audio upload with `license_key`.
2. Backend verifies license with Gumroad.
3. If URL: downloads audio via `yt-dlp` (enforcing size cap). If upload: uses Multer temp file.
4. Transcribe via OpenAI Whisper.
5. Summarize via GPT with a structured system prompt.
6. Respond with `{ ok: true, summary }`.
7. Cleanup temp file.


## Limits & Costs
- **Upload limit**: 60 MB (about 1 hour @ 128 kbps). Keeps RAM/CPU low on free tiers.
- **Cost guardrails**: default to `gpt-4o-mini` for cheap summarization; keep max tokens ~900.
- **Time guardrails**: 3-minute request timeout.


## Error Handling
- Invalid license → 401/403 with clear message.
- Missing/invalid URL or file → 400.
- yt-dlp missing on server → 422 with actionable message.
- Whisper/GPT failure → 422 with generic safe error message.
- Global catch-all → 500.


## Security
- No persistent PII. Optional purchaser email not stored.
- CORS: wide open for MVP; tighten later.
- Env vars only on server.


## Scaling Plan
- Add S3/R2 for >60MB files.
- Use a job queue (BullMQ) + webhook callback for long jobs.
- Move to usage-based billing (Stripe) once MRR justifies.
- Add analytics + retries for yt-dlp.