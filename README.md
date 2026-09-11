# Rec Hall Visiting Teams Kiosk

An iPad touchscreen sign for visiting teams at Rec Hall events. It shows a
full-screen welcome graphic; tapping the screen reveals the event info
graphic (schedule, rotation order, etc.) for 10 seconds, then returns
automatically to the welcome screen for the next visitor.

## Content and scheduling

Design each event's two screens in your usual tool (Canva, Photoshop, etc)
and export them as JPGs, ideally at 1080×1920 (portrait). The app displays
images with `object-fit: contain`, so the whole graphic is always shown
uncropped; if the iPad's screen ratio doesn't exactly match 1080×1920,
you'll get thin bars on the edges rather than any cropping or distortion.

**You can queue up an entire season at once** instead of swapping content
right before each event — the kiosk automatically shows whichever event's
date is today or next upcoming, and moves on to the next one by itself once
a date passes (it rechecks every 30 minutes, no page reload needed). If
every date in the schedule is in the past, it keeps showing the most recent
one rather than going blank.

There are two ways to manage the schedule — you can use either, or both
(Airtable takes priority if it's set up):

### Option A: Airtable (no GitHub needed for routine updates)

Set up once (see **Setting up Airtable** below), then for every new event
staff just add a row: set the date, drag the welcome image into the
**Welcome Image** cell, drag the info image into the **Info Image** cell.
That's it — no filenames to type, no uploading to GitHub, nothing technical.

### Option B: `public/schedule.json` (stays entirely in GitHub)

```json
[
  { "date": "2026-09-12", "welcome": "welcome-1.jpg", "info": "info-1.jpg" },
  { "date": "2026-09-19", "welcome": "welcome-2.jpg", "info": "info-2.jpg" }
]
```

For each event: export the graphics with unique filenames, upload both to
`public/` on github.com, then add a row here with that date and the two
filenames (see **Updating content once it's live** below).

If neither Airtable nor `schedule.json` is set up (or nothing in them
applies), the kiosk falls back to plain `public/welcome.jpg` /
`public/info.jpg` — the original single-event setup still works.

### Multiple iPads showing different teams at once

For a normal day with one visiting team, every iPad shows the same thing —
nothing extra to do. For a day with several simultaneous visiting teams
(e.g. a triangular meet), each iPad needs to show a different team. Both
Airtable and `schedule.json` support an optional **Station** value per row:

- Leave it blank → that row shows on every iPad, as usual.
- Set it to `1`, `2`, or `3` → that row only shows on the iPad set up with
  the matching station (see **Running as a fullscreen kiosk on iPad**
  below for the one-time per-iPad setup). For a 3-team day, add three rows
  with the same date and station `1`, `2`, `3` respectively.

## Setting up Airtable

1. Create a free account at [airtable.com](https://airtable.com) and a new
   base.
2. In that base, create (or rename the default) table to **`Schedule`**
   with exactly these fields:
   - **Date** — field type *Date*
   - **Welcome Image** — field type *Attachment*
   - **Info Image** — field type *Attachment*
   - **Station** — field type *Single line text* (optional — only needed
     for multi-team days, see **Multiple iPads showing different teams at
     once** above)
3. Add a row per event: pick the date, drag the welcome graphic into
   **Welcome Image**, drag the info graphic into **Info Image**.
4. Get your **Base ID**: with the base open, go to
   [airtable.com/create/tokens](https://airtable.com/create/tokens) (or
   Help → API documentation) — the base ID starts with `app...`.
5. Create a **Personal access token**: same page, **Create new token** →
   give it a name → under **Scopes** add `data.records:read` → under
   **Access**, add only this one base → **Create token** → copy it (shown
   once).
6. In Netlify: **Site configuration → Environment variables → Add a
   variable**, and add all three:
   - `VITE_AIRTABLE_TOKEN` — the token from step 5
   - `VITE_AIRTABLE_BASE_ID` — the base ID from step 4
   - `VITE_AIRTABLE_TABLE` — `Schedule`
7. Trigger a redeploy (**Deploys → Trigger deploy → Deploy site**) so the
   build picks up the new environment variables.

Note on privacy: since this is a static site with no backend server, that
token ends up readable inside the site's downloaded JavaScript by anyone who
looks (same as any client-side API key). Scoping it to **read-only** access
on **just this one base** (step 5) keeps the exposure limited to "someone
could see your event schedule," not anything more.

## Running locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5180`. Visit from the iPad's Safari on the same
network to preview on-device.

## Hosting on Netlify (source stays on a private GitHub repo)

The GitHub repo holding this code can stay **private** — Netlify builds
straight from it without needing it public. The deployed site itself is a
plain public URL (like almost any digital sign), but the source, file
history, and images aren't browsable by anyone without repo access.

**One-time setup:**

1. Push this project to your private GitHub repo (see your repo's "…or push
   an existing repository" instructions, or ask for the exact commands).
2. Go to [app.netlify.com](https://app.netlify.com) and sign up/log in
   (**Log in with GitHub** is the simplest option).
3. **Add new site → Import an existing project → Deploy with GitHub**.
   Authorize Netlify to access the repo (you can grant access to just this
   one repo rather than your whole account).
4. Select the repo. Netlify reads `netlify.toml` in this project
   automatically, so the build command and publish folder are already
   configured — just click **Deploy**.
5. After the build finishes (~1 minute), Netlify gives you a URL like
   `https://random-name-123.netlify.app`. Optional: in **Site settings →
   Domain management**, change it to something like
   `rec-hall-visiting-teams.netlify.app`.

## Updating content once it's live

No Mac, no terminal — do this straight from a browser on github.com:

1. Go to the repo → open the `public` folder.
2. Click **Add file → Upload files** to add new event image(s), or click an
   existing file (like `schedule.json`) → the pencil/edit icon to modify it
   directly in the browser.
3. Commit directly to `main`.
4. Netlify picks up the push and rebuilds/republishes automatically within
   about a minute — the kiosk picks up schedule changes within 30 minutes
   on its own, or refresh the iPad to see it immediately.

## Running as a fullscreen kiosk on iPad

1. On the iPad, open the Netlify site URL in Safari. If this iPad is one of
   several used for simultaneous multi-team days, add `?station=1` (or `2`,
   `3`, matching whichever number you'll assign this specific iPad) to the
   end of the URL before continuing — e.g.
   `https://rechallprotocol.netlify.app/?station=1`. If you only ever have
   one visiting team at a time, skip this and just use the plain URL on
   every iPad.
2. Tap the Share button → **Add to Home Screen**. This creates an app icon
   that launches without Safari's address bar or browser chrome. When
   naming the icon, include the station number if you used one (e.g.
   "Rec Hall 1") so it's obvious later which iPad this is.
3. Launch from the Home Screen icon.
4. Physically label the iPad itself (a piece of tape, a label maker, etc)
   with the same number — the Home Screen icon name isn't visible once the
   kiosk is running fullscreen, so you'll want a physical label to tell
   iPads apart at a glance. Keep a note somewhere of which physical
   location/team-area each station number corresponds to.
5. For a fully locked-down kiosk (visitors can't leave the app or access
   other iPad features), enable **Guided Access**:
   - Settings → Accessibility → Guided Access → turn on.
   - Open the Rec Hall app from the Home Screen, then triple-click the side
     button to start a Guided Access session.
   - Set a passcode so only staff can exit.
