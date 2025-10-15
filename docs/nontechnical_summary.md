# How I Built an AI Podcast Summarizer in 48 Hours (With Almost No Budget)


I built a tiny product that turns any podcast episode into clean show notes in about a minute. You paste a YouTube/Spotify link or upload an MP3 (up to 60 MB), and it returns a tidy summary, key takeaways, and SEO keywords.


**Why it works:** podcasters and editors hate writing show notes. It’s repetitive and slow. AI is great at this.


**Stack:**
- Frontend: a clean Next.js page (generated with v0.app).
- Backend: Node.js + Express on Railway’s free tier.
- AI: OpenAI Whisper for transcription, GPT for the summary.
- Payments: Gumroad license keys as a simple paywall (no signup needed).


**Time:** two days from idea to live link.


**Constraints:** I’m bootstrapping, so there’s no S3 or heavy infra. Files are processed and deleted immediately. Uploads are capped at **60 MB** (about one hour at 128 kbps). Or you can paste a YouTube/Spotify/Apple link and it just works.


**What’s next:** if people use it, I’ll add longer uploads, branded exports, and a Pro mode for agencies. If they don’t, I learned a ton and can repurpose the engine for video-to-clips.


If you want to try it or are curious about the build, DM me. I’m sharing notes and would love feedback.