# DriveLegal

> AI-powered Progressive Web App (PWA) for location-aware Indian traffic law guidance and live ride monitoring.

Short description

- Local laws database + national Motor Vehicles Act references
- Multi-language UI (English, हिंदी, தமிழ், ಕನ್ನಡ)
- Live browser monitoring (GPS, speed, ride mode)
- PWA-ready (service worker + manifest)

Quick push instructions

PowerShell (HTTPS + PAT):

```powershell
cd /d D:\project\IIM
git init
git add .
git commit -m "chore: initial commit — DriveLegal"
git branch -M main
git remote add origin https://github.com/tanish430/drive-legal.git
# When prompted for username, enter your GitHub username; for password use a Personal Access Token with repo scope
git push -u origin main
```

SSH (if you have an SSH key added to GitHub):

```powershell
cd /d D:\project\IIM
git init
git add .
git commit -m "chore: initial commit — DriveLegal"
git branch -M main
git remote add origin git@github.com:tanish430/drive-legal.git
git push -u origin main
```

If you want, I can guide you through creating a PAT or setting up SSH keys.# DriveLegal

DriveLegal is a privacy-first progressive web app for the IIT Madras Road Safety Hackathon 2026. It answers location-aware Indian traffic law questions, demonstrates live ride monitoring, and includes an awareness quiz and a submission pack.

## What is included

- Next.js PWA frontend with installable manifest and service worker
- Local law knowledge base for national and selected state/city rules
- Browser-based ride monitoring demo using geolocation, DeviceMotion, and optional voice input/output
- API route for question answering that can later be wired to an LLM + RAG backend
- Submission notes for the pitch deck and setup document

## Run locally

1. Install dependencies.
2. Start the dev server with `npm run dev`.
3. Open the local URL shown in the terminal.

## Environment notes

- The app currently uses a local retrieval engine for answers.
- To connect a hosted LLM, adapt `app/api/ask/route.js` and plug in your provider credentials.
- The demo is designed for HTTPS when using geolocation, speech, notifications, or camera permissions.

## Suggested hackathon story

DriveLegal reduces confusion around state-specific enforcement by combining a legal assistant with live rider safety checks. It is designed to stay privacy-preserving by doing the monitoring on-device and avoiding persistent trip storage.
