import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
* Download audio using yt-dlp (supports YouTube best; also works for many RSS/MP3 URLs).
* - Enforces max size via --max-filesize (e.g., 60M)
* - Outputs temp MP3 file path
*/
export async function downloadAudio(url, { maxMB = 60 } = {}) {
if (!url || typeof url !== 'string') throw new Error('Invalid URL');


const safeId = Math.random().toString(36).slice(2);
const outPath = path.join(__dirname, `tmp-${safeId}.mp3`);


// Ensure tmp dir exists
try { fs.mkdirSync(__dirname, { recursive: true }); } catch {}


const args = [
'-x', '--audio-format', 'mp3',
'--max-filesize', `${maxMB}M`,
'-o', outPath,
url
];


// Note: Railway's Nix-based images may not include yt-dlp by default.
// Workaround: Add yt-dlp as a build step or vendor a tiny binary; for MVP run locally or use a small container.
// For now we attempt to spawn and provide a helpful error if missing.
await new Promise((resolve, reject) => {
const p = spawn('yt-dlp', args);
let stderr = '';
p.stderr.on('data', (c) => { stderr += c.toString(); });
p.on('close', (code) => {
if (code === 0 && fs.existsSync(outPath)) return resolve();
reject(new Error(`yt-dlp failed (code ${code}). Install yt-dlp on server. Details: ${stderr.slice(0,400)}`));
});
});


const stats = fs.statSync(outPath);
const sizeMB = Math.ceil(stats.size / (1024 * 1024));
if (sizeMB > maxMB) {
try { fs.unlinkSync(outPath); } catch {}
throw new Error(`Downloaded file exceeds ${maxMB}MB limit.`);
}


return outPath;
}