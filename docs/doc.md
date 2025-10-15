## 2) docs/doc.md — Cursor + Railway glue (copy into repo)


```md
# Cursor Ops: Wire, Test, Deploy (Backend + Frontend)


## Repo layout
- `backend/` (this API)
- `frontend/` (from v0.app; Next.js)


## Env
Create `backend/.env` using `.env.example` and fill:
- `OPENAI_API_KEY`
- `GUMROAD_PRODUCT_ID`
- (optional) `OPENAI_TRANSCRIBE_MODEL=whisper-1`
- (optional) `OPENAI_SUMMARIZE_MODEL=gpt-4o-mini`


## Local dev (Cursor)
1. Run backend: `cd backend && npm i && npm run start`
2. In `frontend/`, set `NEXT_PUBLIC_API_BASE=http://localhost:3000`
3. Run frontend: `npm i && npm run dev`


## Deploy
### Backend → Railway
- Create new project, connect GitHub, select `backend/` folder.
- Railway will detect Node, set `npm start`.
- Add env vars from `.env`.
- After deploy, grab the public URL (e.g. `https://ps-api.up.railway.app`).


### Frontend → Vercel
- In `frontend/`, set env `NEXT_PUBLIC_API_BASE` to Railway URL.
- Connect to Vercel → Deploy.


## API contract
### POST /api/url
Body: `{ url: string, style?: 'default'|'thread'|'blog', license_key?: string }`
Headers: `x-license-key: <key>` (either header or body)
Resp: `{ ok: true, summary: string } | { error: string }`


### POST /api/upload
FormData fields: `audio` (file), `style?`, and header or field `license_key`
Resp: same as above.


## Limits & UX copy
- **Upload limit:** 60 MB max (≈ 1 hour @ 128 kbps)
- **URLs accepted:** YouTube, many public RSS/MP3 links (most Spotify/Apple shows cross-post to YouTube)
- Files are deleted after processing.