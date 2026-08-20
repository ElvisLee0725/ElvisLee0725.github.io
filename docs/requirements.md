# Requirements — elvislee-website-2026 Migration

Source material: `docs/analysis-legacy-site.md`, `docs/analysis-contact-options.md`, `docs/analysis-github-pages-dns.md`. This doc turns that research into a scoped, ordered plan. Decisions below are final for v1 unless flagged as an open item for Architect.

## Scope

**In scope (v1):** like-for-like migration of the existing one-page site's content, layout, and behavior from Node/Express+React-on-EC2 to a static build hosted on GitHub Pages at `elvislee.com`, with:
- All images and the CV pulled into the repo as committed static assets (no more S3/Google Drive hotlinks).
- A trivial, swappable contact placeholder instead of the broken SendGrid form.
- A modernized build toolchain (off Webpack 4 / `node-sass`).
- A GitHub Actions deploy pipeline, verified on the default `github.io` URL before any DNS change.
- DNS cutover to the custom domain as its own final, deliberate step.

**Explicitly out of scope (v1):**
- Visual/UX redesign of any kind. Content, copy, section order, and look-and-feel carry over unchanged. (Elvis may commission a redesign as a separate future project.)
- Picking the final contact-form/service replacement (Formspree, Web3Forms, EmailJS, etc.) — deferred by Elvis's own choice to a fast-follow milestone (Milestone 7).
- Adding new analytics (GA4 or otherwise). The legacy Universal Analytics tag is dead and gets removed (see Judgment Calls), but replacing it with a live analytics tool is a new feature, not a migration task — punt it, don't decide it here.
- Resurrecting the `HireMe` component — it's unused in production and is being deleted, not migrated.
- DNS cutover happening early/incrementally — it happens once, at the end, after verification.

## Judgment calls (per role brief, small/low-risk items left to PM discretion)

- **Dead Universal Analytics tag** (`UA-58202871-1`): remove it outright during content migration. It's inert (GA sunset UA in 2023, so it's silently doing nothing) and carrying dead tracking code into a fresh build serves no purpose. This is not "adding analytics" — it's deleting code that no longer functions. Low risk: it's a snippet deletion, not a behavior change.
- **Malformed `crossorigin` attribute** on the devicon CDN `<script>` tag (smart-quote artifact, likely browser-ignored today): fix it as part of migrating that HTML into the new build. It's a one-line correction touched anyway while rebuilding the document head; leaving known-broken markup in a rewrite for no reason isn't "like-for-like," it's just carrying forward a typo.
- **Canonical domain — apex vs. `www`**: the legacy repo is internally inconsistent (footer says `www.elvislee.com`, `package.json`/README homepage says apex). Calling it: **`elvislee.com` (apex) is canonical**, `www.elvislee.com` redirects to it. Rationale: apex is the shorter/cleaner form, matches what's already printed as the canonical URL in the legacy repo's own metadata, and is the more common modern default. Architect should set this in Pages settings and DNS accordingly; flag to Elvis if he has a preference, but don't block on it.

## Milestones

### 1. Repo scaffold + build tooling modernization
Stand up the new repo's project skeleton and replace the legacy Webpack 4 + `node-sass` toolchain with a current, actively maintained equivalent (Architect picks the specific tool — e.g. Vite is a reasonable default given this is a static React SPA with SCSS, but the exact choice, config, and file layout are Architect's call, not fixed here).

**Acceptance criteria:**
- Project builds and runs a local dev server on a current Node LTS with no deprecated/unmaintained packages in the critical build path (specifically: no `node-sass`).
- `npm install && npm run build` succeeds clean on a fresh checkout, no manual/global workarounds needed.
- Output is a static bundle (HTML/CSS/JS + assets) with no server process required to serve it.
- Legacy Webpack config is not lifted as-is; keeping it unchanged is not an acceptable outcome per Elvis's direction.

### 2. Content and asset migration
Port all page content/components from the legacy React app into the new scaffold, unchanged in substance (like-for-like), while resolving the two known off-repo dependencies and removing dead code.

**Acceptance criteria:**
- All sections present and rendering with legacy content preserved: Header, ScrollUpBtn, Carousel (incl. typewriter headline), About, Project (all 4 portfolio entries), Skills, Contact section layout (social links + copy — see Milestone 3 for the form/CTA itself), ResumeModal.
- `HireMe`/`single-progress-bar` components are deleted from the codebase, not just left unimported.
- All images (profile photo, carousel cover images at all breakpoints, favicon, 4 project screenshots) are committed into the repo (e.g. `public/assets/images/`) and referenced via relative/local paths — zero references to the old `ubuntu-ec2-s3.s3-us-west-1.amazonaws.com` bucket remain anywhere in source or built output.
- The CV is committed into the repo as a static file (e.g. `public/assets/cv.pdf` or equivalent) and the download button points at it locally — zero references to the Google Drive URL remain. If the original CV/image files can't be recovered from the S3 bucket or Drive link (bucket/permissions may have rotted), flag back to Elvis to supply originals rather than silently reintroducing an external link.
- Dead Universal Analytics snippet is removed; malformed `crossorigin` attribute on the devicon script tag is fixed.
- No server-side code (Express, SendGrid client, `dotenv`, nginx config, `static-middleware.js`) is carried into the new repo.

### 3. Contact-method placeholder
Replace the broken SendGrid form with a trivial, static, obviously-temporary contact affordance — not a new form service integration.

**Decision:** v1 ships a plain `mailto:elvislee0725@gmail.com` link (styled to occupy roughly the same visual slot the form did, without rebuilding form UI/validation that's about to be thrown away). Rationale: the legacy form was already non-functional server-side (the `/api/formSend` handler never calls `res.send()`, and the client shows "message sent" unconditionally regardless of actual delivery — see `analysis-legacy-site.md`), so a working `mailto:` link is a strict reliability improvement over what's live today, costs nothing, requires no new third-party account, and is trivially swappable later since it's a single anchor tag with no client-side state, validation, or API wiring to unwind.

**Acceptance criteria:**
- The old `<form>`, its client-side validation (`sanitize-html`, `validator` usage in `contact.jsx`), and any fetch call to `/api/formSend` are removed entirely — none of it is dead-code-carried into the new repo.
- A visible `mailto:` link (or equivalent simple direct-contact CTA) replaces the form in the Contact section.
- Existing social links (LinkedIn, GitHub, Twitter, Facebook) are preserved as-is (reordering/prioritizing them is a nice-to-have, not required for v1).
- No SendGrid dependency, API key, or env var handling exists anywhere in the new repo.
- The implementation is swappable with near-zero coupling — i.e., Milestone 7 should be able to replace this one link/CTA without touching unrelated components.

### 4. GitHub Actions deploy pipeline (default github.io URL)
Automate build + deploy to GitHub Pages, verified on `<username>.github.io/<repo>` (or org root, per Architect's repo-naming choice) — custom domain not yet involved.

**Acceptance criteria:**
- A GitHub Actions workflow builds the site and deploys it to GitHub Pages on every push to the default branch (or on an explicit trigger — Architect's call), using GitHub's official Pages deploy actions.
- The site is live and fully functional (all sections, images, CV download, contact link) at the default `github.io` URL, with no custom domain configured yet.
- Build reproducibility confirmed: a clean clone + the Actions workflow produces the same output a local build does (guards against the Node-version fragility the old `node-sass` toolchain had).

### 5. Verification
Confirm the github.io deployment is a faithful like-for-like migration before touching DNS at all.

**Acceptance criteria:**
- Manual pass through every section against the legacy live site (or the legacy repo's rendered output) confirming content parity: no missing sections, no broken images, working carousel/typewriter animation, working resume modal (open/close, ESC key), working nav anchors and scroll-up button.
- CV downloads correctly from the new local asset path.
- `mailto:` contact link opens a compose window with the correct address.
- No console errors, no remaining references to old S3/Drive/SendGrid/EC2 endpoints anywhere (search the built output, not just source).
- Basic responsive/mobile check (legacy carousel used responsive `<picture>`/`srcSet` breakpoints — confirm these still work post-migration).

### 6. DNS cutover to elvislee.com (final step, done once, only after Milestone 5 passes)
Point the live custom domain at the verified GitHub Pages deployment. This is deliberately sequenced last and is not something Developer touches early or incrementally.

**Acceptance criteria:**
- Custom domain (`elvislee.com`, canonical per the Judgment Calls decision above) is registered in the repo's Pages settings **before** DNS is repointed (per GitHub's own sequencing guidance — claiming the domain in Settings first prevents a subdomain-takeover window).
- GoDaddy DNS updated: apex `A` records replaced with GitHub Pages' four IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), old EC2 `A` record (`52.52.58.114`) fully removed (not left alongside), `www` given a direct `CNAME` to `<username>.github.io` (not chained through the apex, which was the old broken pattern).
- `CNAME` file present in the published output if the chosen Actions workflow requires one (confirm against whatever Milestone 1/4 build+deploy setup actually produces — see Open Items).
- No stray apex records left over that could block Let's Encrypt cert issuance; the three project subdomains (`scp.`, `flashcard.`, `fun-searcher.elvislee.com`) confirmed untouched/still resolving correctly, since they live in the same DNS zone but are unrelated to this migration.
- "Enforce HTTPS" enabled in Pages settings once available (may take up to ~24h after DNS validates — plan for this, don't expect instant HTTPS at cutover).
- `elvislee.com` and `www.elvislee.com` both resolve to the live site post-propagation, with the non-canonical one redirecting to canonical.
- Old EC2 instance and SendGrid API key are decommissioned only after the above is confirmed stable (avoid tearing down the fallback before the new setup is proven in production DNS, not just on github.io).

### 7. Fast-follow: real contact-method integration (post-v1, not a launch blocker)
Pick and wire up an actual contact-form service to replace the Milestone 3 `mailto:` placeholder, once Elvis decides which option he wants.

**Acceptance criteria (scoped for whenever this is picked up):**
- Options already surveyed in `docs/analysis-contact-options.md` (Formspree, Web3Forms, Getform, EmailJS, or sticking with direct links/mailto permanently) — this milestone starts from "Elvis has chosen one," not from re-researching.
- Whatever is chosen replaces the Milestone 3 CTA cleanly, with no leftover legacy form code to strip (there won't be any, since Milestone 3 already removed it).
- Explicitly **not** a v1 requirement — the site is considered fully launched and successful without this milestone being done.

### 8. Resume refresh: swap in updated CV (post-v1, ongoing maintenance)
Replace `public/assets/cv.pdf` with the newer resume version Elvis provides, whenever he has an updated one to swap in.

**Acceptance criteria:**
- New PDF is committed at `public/assets/cv.pdf`, replacing the current file in place (filename/path stays stable, so `DownloadCvButton.jsx` and `ResumeModal.jsx` need no code changes — this is a data-only swap, per Milestone 2's design).
- `npm run build` produces `dist/assets/cv.pdf` matching the new file (byte-for-byte, not stale/cached).
- Manual check: Download CV from both the About section and the Resume modal, confirm it opens/downloads the new version.
- Not a v1 blocker — this is a recurring maintenance task, triggered whenever Elvis has a newer resume to publish, not a one-time migration step.

## Risks

- **DNS cutover window**: propagation (up to 24h) and cert issuance (up to another 24h) can stack, and the old EC2 `A` record must be fully removed, not just supplemented, or cert issuance can be blocked outright. Mitigated by doing this last, as its own milestone, with Milestone 5 verification complete first.
- **`www` → apex chaining is the exact broken pattern GitHub warns against** and is what's live today — must be replaced with a direct `www` → `github.io` CNAME, not just re-pointed at the new apex A records. Getting this step wrong reproduces the same failure mode on new infrastructure.
- **Stray/leftover DNS records** (from the EC2 era or elsewhere in the GoDaddy zone) could silently block Let's Encrypt cert issuance; nobody has audited the full live zone yet (analysis was via public `dig`, not registrar-panel access) — Milestone 6 needs a live GoDaddy panel check before touching records, not just going off this doc's assumptions.
- **Toolchain migration regressions**: replacing Webpack 4/`node-sass` with a modern build tool is a real rewrite of the build pipeline, not a config tweak — SCSS compilation differences, asset path handling, or JSX/Babel behavior could subtly change rendered output. Mitigated by Milestone 5's explicit parity-check pass before DNS cutover.
- **Asset recovery risk**: images and CV currently live outside the repo (S3, Google Drive) and were never audited for whether Elvis still has originals or ongoing access to those buckets/links. If either has rotted, Milestone 2 blocks on Elvis supplying replacement files.
- **`mailto:` UX gap**: on devices/browsers without a configured default mail client (notably some mobile/Chromebook setups), a `mailto:` link is a dead click. This is a known, accepted tradeoff for v1 — flagged, not silently ignored — and is exactly the gap Milestone 7 exists to close.
- **Scope creep**: both "the site looks dated" and "we should add real analytics while we're in here" are natural temptations once the toolchain is being touched anyway. Both are explicitly out of scope for this migration (see Scope section) — resist folding them in.
- **Sequencing discipline**: DNS cutover (Milestone 6) must not start before Milestone 5 verification passes. Given no CI/CD exists today and this is a solo-maintained personal site, the main enforcement mechanism is this doc + Architect/Developer honoring the milestone order, not a technical gate.

## Open items for Architect

1. Confirm whether the chosen Actions-based deploy workflow needs a committed `CNAME` file (classic Pages behavior auto-manages this; a custom Actions workflow may not — see `analysis-github-pages-dns.md`) — resolve before Milestone 6.
2. Specific build tool choice (Vite suggested, not mandated) and resulting repo file layout.
3. Repo naming and whether the github.io verification URL is a project page (`username.github.io/repo`) or user/org root page — affects asset base paths and is worth locking down before Milestone 1 finishes, since it can change relative-path behavior in the build.
4. Confirm with Elvis directly whether he has a preference on apex-vs-`www` canonical (PM recommendation above is apex; not a hard blocker either way, but worth a quick confirmation before Milestone 6).
