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

**You can queue up an entire season at once** instead of swapping files
right before each event. Content is driven by `public/schedule.json`:

```json
[
  { "date": "2026-09-12", "welcome": "welcome-1.jpg", "info": "info-1.jpg" },
  { "date": "2026-09-19", "welcome": "welcome-2.jpg", "info": "info-2.jpg" }
]
```

For each new event:

1. Export its welcome/info graphics with unique filenames (don't reuse
   `welcome-1.jpg` etc — bump the number, or use anything unique like
   `welcome-ohio-state.jpg`).
2. Upload both image files to `public/` (see **Updating content once it's
   live** below).
3. Add a new row to `schedule.json` with that event's date (`YYYY-MM-DD`)
   and the two filenames you just uploaded.

The kiosk automatically shows whichever event's date is today or next
upcoming — no manual switching, no need to be at the venue when an event
starts. Once an event's date passes, the kiosk moves on to the next entry
in the list by itself (it rechecks the schedule every 30 minutes, so this
happens live without needing a page reload). If you're ever past every date
in the list, it keeps showing the most recent one rather than going blank.

If `schedule.json` is missing/empty, or nothing in it applies, the kiosk
falls back to plain `public/welcome.jpg` / `public/info.jpg` — so the
original single-event setup still works if you don't want to use scheduling
at all. If the resolved `info.jpg` is missing, the info screen shows a
placeholder message instead of a blank/broken image.

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

1. On the iPad, open the Netlify site URL in Safari.
2. Tap the Share button → **Add to Home Screen**. This creates an app icon
   that launches without Safari's address bar or browser chrome.
3. Launch from the Home Screen icon.
4. For a fully locked-down kiosk (visitors can't leave the app or access
   other iPad features), enable **Guided Access**:
   - Settings → Accessibility → Guided Access → turn on.
   - Open the Rec Hall app from the Home Screen, then triple-click the side
     button to start a Guided Access session.
   - Set a passcode so only staff can exit.
