# DriveLegal Setup Document

## Packages

- `next`
- `react`
- `react-dom`

## Project structure

- `app/`: UI shell, layout, page, and API route
- `components/`: client-side helpers such as service worker registration
- `data/`: curated law knowledge base
- `lib/`: retrieval and ride-monitoring logic
- `public/`: manifest, service worker, and icon assets

## Local setup

1. Install dependencies with `npm install`.
2. Start the app with `npm run dev`.
3. Build for production with `npm run build`.

## Demo checklist

- Ask location-based questions about fines and speed limits
- Enable Ride Mode and show live alerts
- Use the quiz slide to explain awareness and compliance
- Mention the privacy-first design and no-storage policy
