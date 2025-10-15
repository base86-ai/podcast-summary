import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// Cost controls: allow env to pick cheaper models by default
const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || 'whisper-1';
const SUMMARIZE_MODEL = process.env.OPENAI_SUMMARIZE_MODEL || 'gpt-4o-mini';


export async function transcribeAudio(filePath) {
if (!fs.existsSync(filePath)) throw new Error('Audio not found');


const file = fs.createReadStream(filePath);
// Whisper API
const transcript = await openai.audio.transcriptions.create({
file,
model: TRANSCRIBE_MODEL,
response_format: 'text'
});
return transcript; // plain text
}


const SUMMARY_SYSTEM = `You are a professional podcast note-taker.
Return concise, high-signal notes suitable for show notes and SEO.
Include sections: Title, One-paragraph Summary, Key Takeaways (bullets), Timestamps (if present), and 5 SEO Keywords.`;


export async function summarizeTranscript(transcriptText, opts = {}) {
const { style = 'default' } = opts;


const styleInstruction = style === 'thread'
? 'Additionally produce a 5-tweet thread with engaging hooks.'
: style === 'blog'
? 'Additionally produce a 3-paragraph blog-style recap.'
: '';


const userContent = `Transcript (may include timestamps):\n\n${transcriptText}\n\n${styleInstruction}`;


const completion = await openai.chat.completions.create({
model: SUMMARIZE_MODEL,
messages: [
{ role: 'system', content: SUMMARY_SYSTEM },
{ role: 'user', content: userContent }
],
temperature: 0.4,
max_tokens: 900
});


const text = completion.choices?.[0]?.message?.content?.trim() || '';
if (!text) throw new Error('Empty summary from model');
return text;
}


export async function cleanupTemp(filePath) {
if (!filePath) return;
try { fs.unlinkSync(filePath); } catch {}
}