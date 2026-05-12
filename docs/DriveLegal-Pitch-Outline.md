# DriveLegal 7-Slide Pitch Outline

## Slide 1: Welcome

- DriveLegal
- AI-powered traffic law assistant and ride-safety PWA
- IIT Madras Road Safety Hackathon 2026

## Slide 2: Problem

- Indian traffic rules vary by state, city, and road class
- Riders and drivers often do not know the right limit or fine for their exact location
- Existing apps do not combine legal guidance with real-time ride safety

## Slide 3: Solution

- Ask a question in English, Hindi, or Tamil
- Share a location or let GPS infer the jurisdiction
- Get road-specific answers, likely fines, and a fallback to official sources

## Slide 4: Demo

- Query examples: speed limit on Delhi highways, fine for triple riding in Bangalore, phone use in Kerala
- Ride Mode: geolocation, speed comparison, motion signals, and alerts
- Voice readout and voice input for hands-free interaction

## Slide 5: Impact

- Better compliance with local traffic laws
- Faster awareness during daily commuting
- Lower accident risk through timely alerts

## Slide 6: Tech

- Next.js PWA frontend
- Browser APIs: Geolocation, DeviceMotion, Speech Synthesis, Speech Recognition, Service Worker
- RAG-ready API route with a local law dataset and retrieval logic

## Slide 7: Assumptions and Thanks

- Demo data uses curated public-rule summaries and should be verified against official notifications before enforcement use
- Monitoring runs locally and stores no ride history
- Thank you
