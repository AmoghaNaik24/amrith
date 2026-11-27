# AMRITH · OPERATION: FIRST MEET 🦋

A private, responsive two-person experience built with React, Vite and Supabase. Designed for laptop, iPad and mobile screens.

## What's included

- Private email/password sign-in for Ammu and Thrinath.
- Eight chapters (27 November–4 December 2026). All chapters are available to signed-in members immediately; the dashboard shows the Hyderabad (IST) and Arizona (MST) clocks and countdown to 4 December, 5:00 PM MST.
- The original eight chapter messages and question prompts, with verified official YouTube links prefilled for the requested songs.
- Shared question threads with realtime updates.
- A private Supabase Storage gallery: 3 image slots per chapter for Days 1–7; 10 image/video slots for Day 8. Uploads are limited to 50 MB per file.
- Dream Boy checklist with the exact groups “Already fulfilled”, “Yet to be discovered”, and “Something we must understand together”. Each member's checked items are saved separately; “Age gap” is in the third group.
- Editable nine-milestone “Our Story” timeline, retaining the original seven story beats and adding two undated connective moments. Only the first and final milestones have dates (27 November and 4 December).
- Shared promises and a time capsule with scheduled reveal times.
- Admin studio to edit chapter messages/titles/song links, edit timeline milestones, edit the final letter, and preview the member view as Thrinath.
- Animated final-letter envelope and a persistent music dock. Direct audio URLs (MP3/M4A/OGG/WAV) support a gentle volume fade; YouTube/Spotify embeds use their own playback controls.
- Lavender night-sky styling, roses, butterflies, stars, and reduced-motion support.

## 1. Create Supabase project

Create a Supabase project. In **SQL Editor → New query**, paste the complete contents of supabase/schema.sql and run it once.

This schema creates the database tables, row-level security policies, the private amrith-private storage bucket, the gallery upload rules, and the initial chapters/questions/timeline/checklist content. Do not run an older copy of the schema.

## 2. Create the two login accounts

In Supabase, open **Authentication → Users → Add user**.

Create two email/password users:
- Ammu
- Thrinath

Use email addresses and passwords that you control. Enable email auto-confirm for these two manually created users if Supabase asks. Turn off public sign-ups so nobody else can create an account.

## 3. Add their profiles

For each user, copy the UUID shown in Authentication → Users. In **SQL Editor → New query**, replace the two placeholders and run:

~~~sql
insert into public.profiles (id, display_name, role, timezone)
values
  ('AMMU-UUID', 'Ammu', 'admin', 'Asia/Kolkata'),
  ('THRINATH-UUID', 'Thrinath', 'member', 'America/Phoenix');
~~~

Do not share either password or the Supabase service-role key. The frontend uses only the publishable/anon key.

## 4. Configure local development (optional)

Copy .env.example to .env and fill in:
- VITE_SUPABASE_URL: Supabase Project URL
- VITE_SUPABASE_ANON_KEY: Supabase publishable key (or legacy anon key)

Then run:

~~~bash
npm install
npm run dev
~~~

## 5. Deploy with GitHub Pages

In the GitHub repository, open **Settings → Secrets and variables → Actions** and add:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Use the publishable/anon key only. Never put service_role or a Supabase secret key in a Vite environment variable.

Then open **Settings → Pages** and choose **GitHub Actions** as the source. Push to main (or run the Deploy workflow manually). The site URL will be:

~~~text
https://AmoghaNaik24.github.io/amrith/
~~~

## 6. Add song links

Sign in as Ammu, open a chapter, and choose **Edit this chapter**. Add a YouTube, Spotify track, or direct audio URL, then save. The music dock stays visible while navigating between the website sections.

## Privacy and permissions

- All application tables use Row Level Security.
- Only the two profiles in profiles can read the app's private content.
- Gallery files live in a private Storage bucket. Authenticated members can view shared gallery media; uploads are stored under the uploader's user ID.
- Never expose the Supabase service-role/secret key in frontend code or GitHub Pages secrets.
- The “Preview as Thrinath” control is a visual preview, not account impersonation. It does not change permissions or sign in as another user.

## Notes

- The SQL schema is intended for a fresh Supabase project and should be run once.
- Media is stored in Supabase Storage; the database stores only its metadata and private object path.
- YouTube and Spotify playback is controlled by their embedded players. Direct audio files use the site's play/pause control and volume fade.
