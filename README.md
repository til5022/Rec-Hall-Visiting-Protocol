# Rec Hall Visiting Teams Kiosk

An iPad touchscreen sign for visiting teams at Rec Hall events. It shows a
full-screen welcome graphic; tapping the screen reveals the event info
graphic (schedule, rotation order, etc.) for 10 seconds, then returns
automatically to the welcome screen for the next visitor.

## Updating content for a new event

Design the two screens in your usual tool (Canva, Photoshop, etc) — same as
the two reference graphics this was built from — and export them as JPGs at
the same filenames:

- **`public/welcome.jpg`** — the landing/attract screen.
- **`public/info.jpg`** — the screen shown for 10 seconds after a tap
  (schedule, rotation order, opponent matchup, etc).

Export at 1080×1920 (portrait). The app displays images with
`object-fit: contain`, so the whole graphic is always shown uncropped; if the
iPad's screen ratio doesn't exactly match 1080×1920, you'll get thin bars on
the edges rather than any cropping or distortion (the existing navy/dark
designs make those bars nearly invisible).

Once hosted (see below), updating content is just replacing these two files
on github.com — no code changes, no Mac needed. See **Updating content once
it's live** below.

If `public/info.jpg` is missing, the info screen shows a placeholder message
instead of a blank/broken image, so it's obvious content still needs to be
added.

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
2. Click `welcome.jpg` (or `info.jpg`) → the pencil/edit icon → **Upload
   files** (or drag the new file onto the page) to replace it.
3. Commit directly to `main`.
4. Netlify picks up the push and rebuilds/republishes automatically within
   about a minute — refresh the iPad to see the update.

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
