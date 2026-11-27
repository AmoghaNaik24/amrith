# AMRITH · OPERATION: FIRST MEET 🦋

A private-feeling, responsive two-person experience built with React and Vite. **The app now runs in local-only mode**: no Supabase connection, no account sync, and no remote database or media storage.

## Sign in
- Name: `Amogha` or `Threeeenadh` (case-insensitive).
- Shared password: configure `VITE_APP_PASSWORD` as a GitHub Actions secret for the published site.
- For local development, copy `.env.example` to `.env` and set the same variable.

## Local-only behaviour
- Each browser/device keeps its own chapters, edits, checklist, responses, promises, time-capsule entries, gallery metadata and uploaded media.
- Text/data is saved in that browser's local storage; uploaded media is saved in that browser's IndexedDB.
- Nothing is transmitted to another device. If Amogha edits a chapter on her laptop, Threeeenadh will not see that edit on his device.
- Clearing browser site data, using a different browser/profile, or switching devices creates a separate empty local copy. Back up important memories before clearing browser data.
- Gallery uploads are local to the device and may use significant browser storage. Browser storage can be cleared by the browser/operating system.

## Features
- Eight original chapters, chapter editing and a built-in play/pause instrumental audio track.
- Hyderabad and Arizona clocks with countdown to December 4, 2026.
- Per-device response threads, gallery with image/video support on the final day, captions and replacement/removal.
- Dream Boy checklist with per-user local checkmarks and notes.
- Little notes, promises, time capsule and a final letter that unlocks on December 4, 2026.
- Admin tools and Threeeenadh preview.

## Deploy to GitHub Pages
1. In GitHub, open **Settings → Secrets and variables → Actions**.
2. Add a repository secret named `VITE_APP_PASSWORD` with the shared password.
3. Ensure Pages uses **GitHub Actions** as its source.
4. Run **Actions → Deploy → Run workflow** on `main`, or push a new commit.

The published URL remains `https://amoghanaik24.github.io/amrith/`.

## Privacy warning
This is a static client-side site. The name/password screen is a lightweight gate, not strong authentication: a visitor with technical access to the published JavaScript can inspect or bypass it. Do not store sensitive or confidential information here. For genuine private access, deploy behind server-side authentication or a protected hosting layer.

## Local development
```bash
cp .env.example .env
npm install
npm run dev
```
Set a private value for `VITE_APP_PASSWORD` in `.env`. Never commit `.env`.
