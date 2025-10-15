import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { summarizeTranscript, transcribeAudio, cleanupTemp } from './helpers/summarize.js';
import { downloadAudio } from './helpers/downloadAudio.js';
import { verifyGumroadLicense } from './utils/gumroad.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '1mb' }));


const PORT = process.env.PORT || 3000;
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 60);
const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID || '';
const REQ_TIMEOUT = Number(process.env.REQUEST_TIMEOUT_MS || 180000);


// Multer temporary storage (disk) — deleted after processing
const upload = multer({
storage: multer.diskStorage({
destination: (req, file, cb) => cb(null, __dirname),
filename: (req, file, cb) => cb(null, `upload-${Date.now()}${path.extname(file.originalname)}`)
}),
limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 }
});


// --- Health
app.get('/health', (req, res) => res.json({ ok: true, t: Date.now() }));


// --- Middleware: simple request timeout
app.use((req, res, next) => {
req.setTimeout(REQ_TIMEOUT);
res.setTimeout(REQ_TIMEOUT);
next();
});


// --- Middleware: Gumroad license check
async function requireLicense(req, res, next) {
try {
const license = (req.headers['x-license-key'] || req.body.license_key || '').toString().trim();
if (!PRODUCT_ID) return res.status(500).json({ error: 'Server missing GUMROAD_PRODUCT_ID' });
if (!license) return res.status(401).json({ error: 'Missing license key' });


const { valid } = await verifyGumroadLicense({ licenseKey: license, productId: PRODUCT_ID });
if (!valid) return res.status(403).json({ error: 'Invalid or expired license key' });


next();
} catch (e) {
return res.status(403).json({ error: 'License verification failed' });
}
}


// --- Route: URL ingestion
app.post('/api/url', express.json({ limit: '2mb' }), requireLicense, async (req, res) => {
const { url, style } = req.body || {};
if (!url || typeof url !== 'string') return res.status(400).json({ error: 'url required' });


let tmpPath;
try {
tmpPath = await downloadAudio(url, { maxMB: MAX_UPLOAD_MB });
const transcript = await transcribeAudio(tmpPath);
const summary = await summarizeTranscript(transcript, { style });
res.json({ ok: true, summary });
} catch (err) {
const msg = (err && err.message) ? err.message : 'Failed to process URL';
res.status(422).json({ error: msg });
} finally {
await cleanupTemp(tmpPath);
}
});


// --- Route: Upload ingestion
app.post('/api/upload', requireLicense, upload.single('audio'), async (req, res) => {
const style = req.body?.style;
const filePath = req.file?.path;
if (!filePath) return res.status(400).json({ error: 'audio file required' });


try {
const transcript = await transcribeAudio(filePath);
const summary = await summarizeTranscript(transcript, { style });
res.json({ ok: true, summary });
} catch (err) {
const msg = err?.message || 'Failed to process audio';
res.status(422).json({ error: msg });
} finally {
await cleanupTemp(filePath);
}
});


// --- Error handler
app.use((err, req, res, next) => {
console.error('Unhandled', err);
res.status(500).json({ error: 'Server error' });
});


app.listen(PORT, () => {
console.log(`Podcast Summarizer API listening on :${PORT}`);
});