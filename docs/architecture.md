# Architecture — elvislee-website-2026 Migration

This document turns `docs/requirements.md` into a concrete, buildable design. It resolves all four "Open items for Architect" from that doc. Nothing here relitigates scope or product decisions already locked in requirements.md (mailto contact, apex-canonical, HireMe deletion, images/CV into repo, no build-tooling-as-is). Developer should be able to implement directly from this doc without making further architectural calls.

---

## 1. Repo hosting shape — decision: user/org root repo

**Decision: create the new GitHub repository named exactly `ElvisLee0725.github.io`** (GitHub's special user-root Pages repo), not a project repo like `elvislee-website-2026` with Pages enabled on it.

**Reasoning:**
- A project repo serves by default at `elvislee0725.github.io/elvislee-website-2026/`, which requires a non-root base path (`vite.config.js` `base: '/elvislee-website-2026/'`, root-relative asset URLs like `/assets/images/...` breaking, React Router basename if ever added, etc.). All of that has to be *unwound* again at DNS cutover when the custom domain takes over at the true root — two path regimes to get right instead of one.
- Requirements' own Milestone 4 mandates verifying a fully working site at the **default github.io URL** before DNS ever touches it (Milestone 5), then a **separate, later** cutover (Milestone 6). A root repo means the default URL (`https://elvislee0725.github.io/`) and the eventual custom-domain URL (`https://elvislee.com/`) have identical path shape — root-relative asset paths (`/assets/images/profile.jpg`, `/assets/cv.pdf`) work unchanged in both, zero base-path reconfiguration at cutover, zero regression risk from that seam.
- This is also the simplest custom-apex-domain story per `docs/analysis-github-pages-dns.md` — one less moving part to explain to a solo maintainer coming back to this repo in a year.
- Cost: none. A user-root Pages repo has no functional downside for a single personal site; it's the standard choice for exactly this use case.

Practical note: the local working directory used to produce these planning docs is named `elvislee-website-2026` — that's fine, it doesn't need to match. The actual GitHub repository Developer creates for the site itself must be named `ElvisLee0725.github.io`.

**Resolves Open Item #3** (repo naming / URL shape): root repo, served at bare `https://elvislee0725.github.io/`, no `/repo-name/` subpath, no base-path config needed anywhere.

---

## 2. Build tooling — decision: Vite (confirmed)

**Confirmed: Vite** (PM's suggested default), with `@vitejs/plugin-react` and Vite's built-in SCSS support (just add `sass` — dart-sass — as a devDependency; no plugin needed, no `node-sass`).

**Reasoning:**
- Small, static, client-only React SPA with SCSS and no SSR need — exactly Vite's sweet spot. Zero-config dev server + fast HMR, minimal `vite.config.js`.
- Directly satisfies Milestone 1's acceptance criteria: no `node-sass` in the dependency tree (dart-sass via the `sass` package instead), clean `npm install && npm run build` on current Node LTS, static bundle output, no server process.
- Legacy webpack config (target `server/public/`, `babel-loader` with only `@babel/plugin-transform-react-jsx`, `node-sass`/`sass-loader@8`/`css-loader@3`/`mini-css-extract-plugin@0.9`) is not reused in any form, per Elvis's explicit direction — it's replaced wholesale, not patched.

**Other build decisions bundled in here (low-risk, Architect's call, in scope of "modernize toolchain"):**
- **Node version**: pin to a current LTS via `.nvmrc` (`20`) and `package.json` `"engines": { "node": ">=20" }`. Directly addresses the legacy risk that `node-sass@^4.13.1` had no pinned Node version and doesn't build cleanly on modern Node.
- **React**: bump to React 18, using `createRoot` (`react-dom/client`) in place of the legacy `ReactDOM.render`. Low risk — the legacy code already uses hooks (`useState`/`useEffect` in `resume-modal.jsx`), nothing depends on React 16/17-specific legacy APIs (string refs, etc.), and Vite's React ecosystem defaults assume 18. This is a version bump, not a rewrite.
- **Bootstrap/jQuery/Popper/Font Awesome/Google Fonts/devicon**: **keep loaded via CDN `<script>`/`<link>` tags in `index.html`, unchanged**, rather than npm-installing/bundling them. The legacy site already loads 100% of these from CDN (not bundled by webpack either), so this is genuinely like-for-like and avoids scope creep — Bootstrap 4's jQuery-driven carousel (`data-ride='carousel'`) keeps working exactly as before since the React app just renders markup with the same `data-*` attributes; Bootstrap JS attaches behavior after DOM mount, same as today. Only the two PM-flagged fixes apply to this markup: remove the dead Universal Analytics (`UA-58202871-1`) snippet, and fix the malformed `crossorigin="”anonymous”"` attribute on the devicon `<script>` tag to `crossorigin="anonymous"`.

**Resolves Open Item #2** (build tool choice): Vite, confirmed, no alternative needed.

---

## 3. Repo / file layout

```
ElvisLee0725.github.io/                  (repo root)
├── .github/
│   └── workflows/
│       └── deploy.yml                   # CI/CD, see §4
├── public/                              # copied as-is to dist/ root by Vite
│   ├── assets/
│   │   ├── images/
│   │   │   ├── profile.jpg              # About section photo
│   │   │   ├── favicon.ico
│   │   │   ├── carousel/
│   │   │   │   ├── cover-sm.jpg         # <picture>/srcSet breakpoints
│   │   │   │   ├── cover-md.jpg
│   │   │   │   ├── cover-lg.jpg
│   │   │   │   └── cover-xl.jpg
│   │   │   └── projects/
│   │   │       ├── super-coupon-pocket.png
│   │   │       ├── the-small-circle.png
│   │   │       ├── flashcard.png
│   │   │       └── fun-searcher.png
│   │   └── cv.pdf                       # replaces Google Drive link
│   └── CNAME                            # ADDED ONLY AT MILESTONE 6 — see §6
├── src/
│   ├── main.jsx                         # entry: createRoot(...).render(<App/>)
│   ├── App.jsx                          # was client/components/app.jsx
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx               # was header.jsx
│   │   ├── ScrollUpBtn/
│   │   │   └── ScrollUpBtn.jsx
│   │   ├── Carousel/
│   │   │   └── Carousel.jsx             # incl. #typewriter span
│   │   ├── About/
│   │   │   ├── About.jsx
│   │   │   └── DownloadCvButton.jsx     # points at /assets/cv.pdf
│   │   ├── Projects/
│   │   │   ├── Projects.jsx             # was project.jsx
│   │   │   └── SingleProject.jsx        # was single-project.jsx
│   │   ├── Skills/
│   │   │   ├── Skills.jsx
│   │   │   └── SingleIcon.jsx
│   │   ├── Contact/
│   │   │   ├── Contact.jsx              # section shell + social links + Footer
│   │   │   ├── ContactCta.jsx           # the mailto CTA — see §5, isolated for M7 swap
│   │   │   └── Footer.jsx
│   │   └── ResumeModal/
│   │       └── ResumeModal.jsx
│   ├── hooks/                           # was client/modules/*.js
│   │   ├── useRevealOnScroll.js         # was revealOnScroll.js
│   │   ├── useTypewriter.js             # was typewriter.js
│   │   └── useResumeModal.js            # was modal.js (open/close + ESC key)
│   └── styles/
│       ├── main.scss                    # single entry, imported once in main.jsx
│       ├── _variables.scss
│       ├── _mixins.scss
│       └── components/                  # one partial per component, as legacy had
│           ├── _header.scss
│           ├── _carousel.scss
│           ├── _about.scss
│           ├── _projects.scss
│           ├── _skills.scss
│           ├── _contact.scss
│           └── _resume-modal.scss
├── index.html                           # Vite root HTML; CDN tags, GA tag removed, crossorigin fixed
├── vite.config.js                       # base: '/', @vitejs/plugin-react
├── package.json
├── .nvmrc                               # "20"
└── .gitignore
```

**Mapping from legacy `client/`:**
- `client/components/*.jsx` → `src/components/**/*.jsx` (one folder per section, co-located with its own SCSS partial).
- `client/modules/*.js` (vanilla DOM helpers: `revealOnScroll.js`, `typewriter.js`, `modal.js`) → `src/hooks/*.js`, converted to plain functions or small hooks called from the relevant component — same behavior, no server dependency to begin with so this is a straight port.
- `client/styles/` → `src/styles/`, entry point imported once from `src/main.jsx` (Vite/Sass compiles it; no more manual `mini-css-extract-plugin` config).
- `client/components/hire-me.jsx` + `single-progress-bar.jsx` → **deleted, not migrated** (per requirements Milestone 2 — orphaned, unused in production).
- `server/`, `webpack.config.js`, any Babel config, `static-middleware.js`, the example nginx conf, `dotenv`, `@sendgrid/mail` → **not migrated at all.** No server-side code, no `.env` handling, ships in the new repo.
- Images (currently hotlinked from `ubuntu-ec2-s3.s3-us-west-1.amazonaws.com`) → committed into `public/assets/images/`, referenced by root-relative paths (`/assets/images/...`) directly in JSX — safe because this is a root Pages repo (§1), so root-relative paths resolve identically on the default `github.io` URL and after DNS cutover to `elvislee.com`.
- CV (currently a Google Drive share link) → committed as `public/assets/cv.pdf`, `DownloadCvButton.jsx` points at `/assets/cv.pdf` locally.

If either the original images or CV can't be recovered (S3/Drive access may have rotted) — per requirements, that blocks Milestone 2 and needs Elvis to supply originals; not an architecture question.

---

## 4. CI/CD — GitHub Actions, modern `actions/deploy-pages` flow

**Decision: use the official Actions-based Pages deploy flow** (`actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`), with Pages "Source" set to **GitHub Actions** in repo settings — not classic branch-based deploy (no `gh-pages` branch, no `peaceiris/actions-gh-pages` or similar third-party action).

**Reasoning:** it's GitHub's current first-party supported path (branch-based deploy is the legacy mechanism the Pages product itself is steering people away from), it needs no extra write-access token/branch juggling (uses the built-in `id-token`/`pages` permissions and `GITHUB_TOKEN`), and the deploy artifact is exactly `npm run build`'s `dist/` output with no extra branch-commit step in between — one fewer thing that can drift from source.

`.github/workflows/deploy.yml` (concrete shape Developer implements):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- **Trigger**: push to `main`, plus `workflow_dispatch` for manual re-runs (useful right after DNS cutover if a redeploy is wanted without a code change). No PR-preview deploys needed for a solo personal site — out of scope.
- **This exact workflow is used for both Milestone 4 (verify on default github.io URL) and Milestone 6 (post-cutover) — it does not change at cutover.** Only the repo's Pages settings (custom domain field) and DNS change at Milestone 6; the pipeline itself is identical before and after, which is the direct payoff of the root-repo + root-relative-paths decision in §1/§3.

---

## 5. Contact placeholder — exact implementation shape

Replaces the entire legacy `<form>` + `sanitize-html`/`validator` client-side validation + `fetch('/api/formSend')` call, all of which is deleted outright (per requirements Milestone 3 — none of it is dead-code-carried over).

**UI element**: a single `<a>` styled as a button, occupying the same visual slot the form occupied in the Contact section, e.g.:

```jsx
// src/components/Contact/ContactCta.jsx
export default function ContactCta() {
  return (
    <a
      className="contact-cta-btn"          // reuse existing button styling class(es)
      href="mailto:elvislee0725@gmail.com?subject=Portfolio%20Inquiry"
    >
      Get in Touch
    </a>
  );
}
```

- **Address**: `elvislee0725@gmail.com` (matches both the legacy SendGrid `to` field and the `ResumeModal`'s hardcoded contact email — consistent across the site).
- **Subject**: pre-filled (`Portfolio Inquiry`) as a small nicety so the sender doesn't start from a blank subject line; **body left empty** — no presumptive pre-filled message text, keep it minimal.
- **Styling**: reuse whatever button/CTA class the legacy design system already has (e.g. the same visual weight as the old submit button) so it "occupies roughly the same visual slot," per requirements — no new visual design, no form-field layout to rebuild.
- **`Contact.jsx`** (the section shell) renders `<ContactCta />` in place of the old `<form>`, and keeps the existing social icon links (LinkedIn, GitHub, Twitter, Facebook) and `Footer` untouched, exactly as requirements Milestone 3 specifies.

**Where Milestone 7 (real contact form) plugs back in**: swap the internals of `ContactCta.jsx` only. Because it's isolated as its own component with no props, no shared state, and no coupling to `Contact.jsx` beyond being rendered in one spot, Milestone 7 replaces this one file (e.g. with a Formspree/Web3Forms `<form>` or an EmailJS-wired component) without touching `Contact.jsx`, `Footer.jsx`, or any other component. This is the "near-zero coupling" swap point requirements Milestone 3 asks for.

---

## 6. DNS / domain cutover — Milestone 6 procedure

**Do not execute any part of this section until Milestones 1–5 are complete and verified on `https://elvislee0725.github.io/`.** This is written to be directly actionable when that milestone starts, not as day-one setup work.

**Step order matters** (claim-before-DNS, per GitHub's own subdomain-takeover guidance):

1. **In the `ElvisLee0725.github.io` repo → Settings → Pages**, enter `elvislee.com` in the "Custom domain" field and save. This registers/claims the domain in GitHub's Pages settings *before* DNS points at it — do this first, not after step 2.
2. **Add the CNAME file to the repo**: create `public/CNAME` containing exactly one line, no trailing content:
   ```
   elvislee.com
   ```
   Commit this and let it deploy through the same Actions workflow (§4) — it lands at `dist/CNAME`, i.e. the root of the published site. Rationale for committing this even though the Actions-based deploy flow doesn't strictly *require* it (per `docs/analysis-github-pages-dns.md`, custom domain can be configured purely via Settings for Actions-based deploys): it's a zero-cost belt-and-suspenders record — version-controlled, survives if Pages settings ever get reset, and matches the file GitHub's own UI would have created for a classic branch deploy. **Resolves Open Item #1**: yes, commit a `CNAME` file, added at this milestone only (not Milestone 1).
3. **At GoDaddy (registrar/DNS host, `ns17`/`ns18.domaincontrol.com`), update the DNS zone for `elvislee.com`:**
   - **Remove** the existing apex `A` record pointing to `52.52.58.114` (the old EC2 IP) — full removal, not left alongside new records. A stray leftover record here is the single most likely thing to silently block Let's Encrypt cert issuance.
   - **Add** four apex `A` records pointing to GitHub Pages' IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
     (AAAA records optional/additional per GitHub's guidance — not required; skip unless there's a specific reason to add them.)
   - **Replace** the existing `www` record — currently a `CNAME` chained to the apex (`www.elvislee.com` → `elvislee.com`, the exact broken pattern GitHub warns against) — with a **direct** `CNAME`: `www.elvislee.com` → `elvislee0725.github.io` (not through the apex).
   - **Before saving**, do a live panel check (not just the public `dig` lookups the analysis doc used) for any other stray records at the apex or at `www` beyond what's specified above, and confirm the `scp.`, `flashcard.`, and `fun-searcher.` project subdomains are untouched by these apex-only changes (they live in the same zone but are unrelated).
4. **Wait for DNS propagation** (up to 24h depending on prior TTLs) and then **for GitHub's automatic Let's Encrypt cert issuance** (a separate up-to-24h step *after* DNS validates — these can stack to ~48h worst case; don't expect instant HTTPS).
5. **Enable "Enforce HTTPS"** in Settings → Pages once the checkbox becomes selectable (it's greyed out until the cert is issued and attached).
6. **Verify** both `https://elvislee.com` and `https://www.elvislee.com` resolve to the live site, with `www` auto-redirecting to the apex (GitHub handles this redirect automatically once both domains' DNS records are correctly in place and `elvislee.com` is the one registered as primary in Settings).
7. **Only after the above is confirmed stable in production DNS** (not just verified earlier on the github.io URL): decommission the old EC2 instance and revoke/delete the SendGrid API key. Don't tear down the EC2 fallback before the new setup is proven live at the real domain.

---

## Summary of decisions (quick reference)

| Area | Decision |
|---|---|
| Repo name/shape | `ElvisLee0725.github.io` (user-root Pages repo), not a project repo |
| Default URL | `https://elvislee0725.github.io/` (no subpath) |
| Build tool | Vite + `@vitejs/plugin-react` + dart-sass (`sass` package) |
| Node version | Pinned via `.nvmrc` / `engines`, current LTS (20) |
| React version | Bumped to 18 (`createRoot`) |
| Vendor libs (Bootstrap/jQuery/Popper/FA/devicon) | Kept as CDN `<script>`/`<link>` tags in `index.html`, unchanged except the two flagged fixes |
| Asset paths | Root-relative (`/assets/...`), safe because of root-repo choice |
| CI/CD | GitHub Actions, `actions/deploy-pages` flow (not branch-based) |
| CNAME file | Committed at Milestone 6 only, `public/CNAME` → `elvislee.com` |
| Contact placeholder | `mailto:elvislee0725@gmail.com?subject=Portfolio%20Inquiry`, isolated in `ContactCta.jsx` |
| Canonical domain | `elvislee.com` apex (per requirements.md; `www` redirects to it) |
