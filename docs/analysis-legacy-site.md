# Legacy Site Audit — elvislee-website-react-2020

Source: https://github.com/ElvisLee0725/elvislee-website-react-2020 (default branch `master`, single squashed commit `8f21e9b` in the clone used for this audit — full history wasn't fetched, shallow clone only).

## Summary

The legacy app is a single-page React 16 site built with a custom Webpack 4 config, served by a thin Express server that does exactly two things: (1) `express.static()` on a pre-built `server/public/` folder, and (2) one `POST /api/formSend` endpoint that emails a contact-form submission via SendGrid. Critically, **the built output (`server/public/index.html` + `main.js` + `styles.css`) is already a pure client-side-rendered static bundle** — there is no server-side rendering, no server-side templating, and no server-side reads of request data other than the form endpoint. That means the bulk of the site (everything except the contact form) is already "GitHub-Pages-shaped"; the only genuine incompatibility is the SendGrid POST endpoint itself. Several assets (all photos, the resume CV file) are **not in the repo** — they're hotlinked from an external S3 bucket and Google Drive, which is a dependency risk independent of the hosting migration.

## Site inventory (one-page sections, in render order per `client/components/app.jsx`)

`App` renders, in order: `Header` -> `ScrollUpBtn` -> `Carousel` -> `About` -> `Project` -> `Skills` -> `Contact` -> `ResumeModal`.

- **Header** (`client/components/header.jsx`) — fixed-top nav with in-page anchor links to `#about`, `#projects`, `#skills`, `#contact`, plus a "RESUME" link (`id='openModal'`) that opens the resume modal. Adds a background class on scroll (`window.scrollY > 70`), throttled via lodash.
- **ScrollUpBtn** (`scroll-up-btn.jsx`) — simple back-to-top anchor (`href='#'`), visibility toggled by `client/modules/revealOnScroll.js`.
- **Carousel** (`carousel.jsx`) — Bootstrap 4 JS carousel (`data-ride='carousel'`) with `<picture>`/`srcSet` responsive images. Only one active slide is live; a second "Rocker Cover" slide is commented out in JSX (dead markup, not currently visible). Contains the `#typewriter` span consumed by `client/modules/typewriter.js` for the animated headline ("Full Stack Developer" / "Software Engineer" / "Programmer").
- **About** (`about.jsx`) — bio text + profile photo + `DownloadCV` button.
- **Project** (`project.jsx` + `single-project.jsx`) — 4 hardcoded portfolio entries (Super Coupon Pocket, The Small Circle, Flashcard, Fun Searcher), each with source-code link, live-demo link, and image, all hardcoded as a JS array inside the component (no CMS/API).
- **Skills** (`skills.jsx` + `single-icon.jsx`) — three icon grids (Languages, Frameworks, Dev Tools) using devicon classes.
- **Contact** (`contact.jsx`) — the contact form (see below) plus social icon links (Twitter, Facebook, GitHub, LinkedIn) and a shared `Footer`.
- **ResumeModal** (`resume-modal.jsx`) — a full resume rendered as JSX (not a PDF viewer), opened/closed via `client/modules/modal.js` (vanilla DOM class toggling, ESC-key close). Phone (`+1 (213) 880-5255`) and email (`elvislee0725@gmail.com`) are hardcoded directly in the component via `useState`/`useEffect` — **not** read from any env var or server call, so this part needs no changes for a static migration.
- **HireMe** (`hire-me.jsx` + `single-progress-bar.jsx`) — a fully-built "skill percentage bar" section that is **not imported or rendered anywhere** in `app.jsx`. Dead/orphaned component. Flag for PM: keep, delete, or resurrect?

## Contact form flow (exact mechanics)

Client side — `client/components/contact.jsx`:
1. Controlled form with `email` and `message` fields, both client `useState`/`this.state`.
2. On submit, `validate()` runs client-side checks only: trims/lowercases email, sanitizes `message` via `sanitize-html` (`allowedTags: []`, `allowedAttributes: {}` — strips all HTML), validates email format via `validator`'s `isEmail`. Empty-field and invalid-email checks produce inline Bootstrap alert messages.
3. On success, does `fetch('/api/formSend', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, message }) })`. It logs the response but never actually checks `response.ok` or displays SendGrid errors to the user — **the "Your message is sent. Thank you!" success message is shown unconditionally as soon as client-side validation passes, before the fetch even resolves.** So historically, a SendGrid failure would still tell the visitor their message was sent.

Server side — `server/index.js` (full file, 39 lines):
```js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const sgMail = require('@sendgrid/mail');
const staticMiddleware = require('./static-middleware');
sgMail.setApiKey(process.env.SENDGRIDAPIKEY);

app.use(staticMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/formSend', (req, res) => {
  const { email, message } = req.body;
  const msg = {
    to: 'elvislee0725@gmail.com',
    from: 'elvis0725@hotmail.com',
    subject: 'You have a new message from elvislee.com',
    text: `From: ${email} \n        ${message}`,
    html: `<p>From: ${email}</p> \n        <p>${message}</p>`,
  };
  sgMail.send(msg)
    .then(() => { console.log(`Message from ${email} was sent successfully.`); })
    .catch((err) => { console.log('Error: ' + err.message); });
});

app.listen(process.env.PORT, () => {
  console.log('Listening on PORT: ', process.env.PORT);
});
```

Notable, concrete findings:
- **The route handler never calls `res.send()`/`res.json()`** — the client's `fetch(...).then(r => r.json())` on the response would actually throw/reject on an empty body in practice (masked because the `.catch` just logs to console and the UI already shows "success" regardless).
- **Zero server-side validation or sanitization.** `sanitize-html` and `validator` are `dependencies` in `package.json` and are imported, but only inside `client/components/contact.jsx` — i.e., they run in the browser, not on the server. The Express endpoint trusts `req.body.email`/`req.body.message` as-is. Anyone can `curl` the endpoint directly and bypass all client-side checks (no rate limiting, no CAPTCHA, no server validation, no CORS restriction visible either).
- **Env vars read**: `SENDGRIDAPIKEY` (SendGrid API key, via `dotenv`), `PORT` (server listen port). `README.md` also documents `DEV_SERVER_PORT` for the webpack-dev-server proxy target (dev-only, `webpack.config.js` line 48-51 proxies `/api` -> `http://localhost:${PORT}`).
- Recipient (`to`) and sender (`from`) addresses are hardcoded in source (`elvislee0725@gmail.com` / `elvis0725@hotmail.com`), not env vars.

## What will NOT survive a lift-and-shift to static GitHub Pages hosting

| Legacy piece | File(s) | Why it breaks on GH Pages |
|---|---|---|
| Express server itself | `server/index.js` | GitHub Pages serves static files only — no Node runtime, no `app.listen`, no request handling at all. |
| `server/static-middleware.js` | `server/static-middleware.js` | Just wraps `express.static('server/public')` — functionally replaced by GH Pages' own static file serving, but the *build output path* convention (`server/public/`) will likely need to change to match GH Pages' expected publish source (repo root or `/docs`, or a `gh-pages` branch — see `docs/analysis-github-pages-dns.md` for Pages-specific mechanics; not decided here). |
| `POST /api/formSend` SendGrid call | `server/index.js` lines 14-34 | No server to receive the POST at all; `sgMail.send()` requires a server-side API key (`SENDGRIDAPIKEY`) that must never ship to a static client bundle. This endpoint has no static equivalent — needs a completely different contact mechanism (see `docs/analysis-contact-options.md`). |
| `process.env.SENDGRIDAPIKEY`, `process.env.PORT`, `dotenv.config()` | `server/index.js`, `webpack.config.js` | No server process to read `process.env` from at runtime in production. (Build-time env injection via `dotenv-webpack` still works for a static build if ever needed for something client-safe, but there's currently nothing in the client that needs a secret — and nothing should be added that does.) |
| nginx reverse proxy config | `full-stack-project.example.conf` | Proxies `/api` to `localhost:3001` and serves `server/public` as `root`; this whole nginx+EC2 layer is replaced wholesale by GitHub's Pages infrastructure. Note the file's `server_name` is `full-stack-project.learningfuze.com`, a bootcamp-template placeholder, not `elvislee.com` — so this file is explicitly an *example*, not the live nginx config (the real one, if it exists, isn't in this repo). |
| `npm run start` (`NODE_ENV=production node server/index.js`) | `package.json` | No process manager/Node process on GH Pages; only `npm run build` (webpack production build) is relevant going forward. |

## External / off-repo dependencies (not a hosting-migration blocker per se, but a risk to flag)

- **All imagery is hotlinked from `https://ubuntu-ec2-s3.s3-us-west-1.amazonaws.com/elvislee/images/...`** (profile photo, carousel cover images at 4 breakpoints, favicon, all 4 project screenshots) — referenced in `client/components/about.jsx`, `carousel.jsx`, `project.jsx`, and `server/public/index.html`. None of these image files are in the git repo. If that S3 bucket is ever deleted/EC2 account closed, every image on the site breaks regardless of where the HTML/JS is hosted. Open question for PM/Architect: pull these into the new repo as committed static assets, or keep pointing at S3?
- **CV download** (`downloadCV-btn.jsx`) links to a Google Drive share URL (`drive.google.com/uc?id=...&export=download`) — external, outside repo, works independent of hosting choice but same "silent rot" risk.
- **`server/public/index.html`** loads, all via CDN with SRI hashes: jQuery 3.3.1 slim, Popper 1.14.7, Bootstrap 4.3.1/4.4.1 JS+CSS (two different Bootstrap versions referenced — 4.4.1 CSS vs 4.3.1 JS, inconsistent), Font Awesome 5.11.2, Google Fonts (Raleway), devicon (via jsdelivr, **no SRI hash** on that one, and its `crossorigin` attribute is malformed with smart quotes: `crossorigin="”anonymous”"` — likely a copy-paste artifact from a rich text editor, functionally probably ignored by the browser but worth cleaning up).
- **Google Analytics** — `UA-58202871-1`, i.e. **Universal Analytics**, which Google fully sunset (stopped processing data) in mid-2023. This tag is dead weight already; if analytics is wanted on the new site it needs GA4 (or another provider) regardless of the hosting migration.

## Build tooling notes (relevant to whether a straight "build once, commit output" migration is even feasible)

- Webpack 4 (`webpack.config.js`) — build target `server/public/`, entry `client/`, `babel-loader` with `@babel/plugin-transform-react-jsx` only (no full `@babel/preset-env`), SCSS via `node-sass` (long deprecated/unmaintained, has known install pain on modern Node versions) + `sass-loader` 8 + `css-loader` 3 + `mini-css-extract-plugin` 0.9 — all several major versions behind current.
- `package.json` has no `engines` field pinning a Node version; given `node-sass@^4.13.1`, this build most likely will not run cleanly on a current Node LTS without either upgrading the sass toolchain (e.g., swap to `sass`/dart-sass) or pinning an old Node version in CI. This is a build-reproducibility risk for GitHub Actions-based Pages deploys specifically, independent of the contact-form question.
- No CI/CD config of any kind in the repo (no `.github/workflows`, no `Procfile`, no deploy script) — deployment to EC2 was presumably manual or via some external process not captured here.

## Open questions for PM / Architect

1. Keep the resume as in-page JSX (current behavior) vs. a downloadable/embedded PDF — no change required either way for GH Pages, just a product decision.
2. Resurrect, delete, or ignore the orphaned `HireMe` component?
3. Migrate the S3-hosted images and Google-Drive-hosted CV into the new repo as committed assets, or keep external hotlinks?
4. Replace or keep Universal Analytics (dead) — add GA4, another analytics tool, or none?
5. Rebuild the SCSS/Webpack toolchain (dart-sass, current Webpack/Vite, etc.) as part of migration, or is a tooling upgrade explicitly out of scope for this migration?
6. Confirm build output path/publish strategy for GitHub Pages (repo root, `/docs` folder, `gh-pages` branch, or Actions-based deploy) — determines whether `server/public/` conventions carry over at all.
