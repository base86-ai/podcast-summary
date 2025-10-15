# v0.app Prompt — Podcast Summarizer Frontend


Build a **Next.js + TypeScript + Tailwind** single page with a modern, minimal aesthetic.


## Requirements
- Two tabs in a Card UI: **URL** and **Upload**.
- Shared field for **Gumroad License Key**.
- A **Generate Summary** button.
- An output area showing the returned summary (monospace or Markdown style) with a copy button.
- Show **limits** text: "Upload up to 60 MB (≈ 1 hr @ 128 kbps). Or paste a YouTube/Spotify/Apple link."
- Use env var `NEXT_PUBLIC_API_BASE` for API base URL.


## API integration
When user clicks **Generate Summary**:
- If URL tab active → `POST ${NEXT_PUBLIC_API_BASE}/api/url` with JSON body `{ url, style, license_key }`.
- If Upload tab active → `POST ${NEXT_PUBLIC_API_BASE}/api/upload` with `FormData` (fields: `audio`, `style`, `license_key`).
- On 200 OK with `{ ok: true, summary }`, render summary.
- On error with `{ error }`, show toast/banner.


## Components
- Tabs: URL | Upload
- Inputs: URL text input, file input (accept .mp3,.wav)
- Select: style (default | blog | thread)
- Input: license key
- Button: Generate
- Result: preformatted block, Copy-to-clipboard
- Helpers: tiny loading spinner and error state


## UX notes
- Disable Generate button until URL or File is provided and a license key is present.
- Show a tiny privacy note: "Audio is deleted after processing."
- Mobile responsive.


## Code stubs
Create `utils/api.ts`:
```ts
export async function summarizeByUrl(base: string, payload: { url: string; style?: string; license_key: string; }) {
const res = await fetch(`${base}/api/url`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
return res.json();
}
export async function summarizeByUpload(base: string, file: File, payload: { style?: string; license_key: string; }) {
const fd = new FormData();
fd.append('audio', file);
if (payload.style) fd.append('style', payload.style);
fd.append('license_key', payload.license_key);
const res = await fetch(`${base}/api/upload`, { method: 'POST', body: fd });
return res.json();
}

Env

NEXT_PUBLIC_API_BASE → set to Railway backend URL in Vercel.