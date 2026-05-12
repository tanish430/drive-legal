# DriveLegal

DriveLegal is a privacy-first progressive web app for the IIT Madras Road Safety Hackathon 2026. It answers location-aware Indian traffic law questions, highlights the relevant sections and citations, and includes a live ride monitoring demo plus an awareness quiz.

## What’s included

- Next.js PWA frontend with installable manifest and service worker
- Local law knowledge base for national and selected state/city rules
- Multi-language UI for English, हिंदी, தமிழ், and ಕನ್ನಡ
- Browser-based ride monitoring using geolocation, DeviceMotion, and optional voice input/output
- API route for question answering that can later connect to an LLM + RAG backend
- Hackathon submission notes for the pitch deck and setup document

## Run locally

1. Install dependencies.
2. Start the dev server with `npm run dev`.
3. Open the local URL shown in the terminal.

## Legal and product notes

- The app currently uses a local retrieval engine for answers.
- Answers are formatted to include act and section references where available.
- To connect a hosted LLM, adapt `app/api/ask/route.js` and add your provider credentials.
- The demo is designed for HTTPS when using geolocation, speech, notifications, or camera permissions.

## Suggested hackathon story

DriveLegal reduces confusion around state-specific enforcement by combining a legal assistant with live rider safety checks. It stays privacy-preserving by doing monitoring on-device and avoiding persistent trip storage.

## Quick push reminder

```powershell
cd /d D:\project\IIM
& 'C:\Program Files\Git\bin\git.exe' push -u origin main
```
