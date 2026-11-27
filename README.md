# OPERATION: FIRST MEET 🦋
React + Vite front-end on GitHub Pages, Supabase for login, data, realtime and server-side unlock times.

## Deploy
1. **Supabase**: create a free project. SQL Editor → paste and run `supabase/schema.sql`.
2. **Users**: Authentication → Users → *Add user* (auto-confirm) for Ammu and Thrinath, with passwords. Turn off public sign-ups in Auth settings.
3. Copy each user's UUID, then run in the SQL Editor:
```sql
insert into profiles values ('AMMU-UUID','Ammu','admin','Asia/Kolkata');
insert into profiles values ('THRINATH-UUID','Thrinath','member','America/Phoenix');
```
4. **Songs**: Table editor → `chapters` → paste a YouTube or Spotify track link into `song_url` per day.
5. **GitHub**: create a repo, push this folder to `main`. Settings → Secrets and variables → Actions → add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Supabase → Project Settings → API; use the anon key only, never service_role). Settings → Pages → Source: **GitHub Actions**.
6. Push again (or run the workflow). Site appears at `https://USER.github.io/REPO/`.

## Local
`cp .env.example .env`, fill in, `npm install`, `npm run dev`.

## How unlocking works
Row Level Security calls `chapter_unlocked()` using the database clock and each person's timezone. Chapters unlock at 8:00 AM local; Dec 4 at 5:00 PM local, after which everything is open. Changing a phone clock has no effect. Ammu (admin) sees all chapters.

## Not built yet
Uploads/gallery, admin UI, timeline, checklist, animated letter, music fades, promises, time capsule.
