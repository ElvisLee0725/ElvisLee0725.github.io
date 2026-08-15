# GitHub Pages + Apex Custom Domain (elvislee.com) — Requirements & Gotchas

## Summary

GitHub Pages supports a custom apex domain like `elvislee.com`, but it requires a specific DNS setup at the registrar (A/AAAA records, or an ALIAS/ANAME record where the DNS provider supports it), plus a `CNAME` file in the Pages-published branch/folder that tells GitHub which domain to serve. HTTPS is automatic but not instant — up to 24 hours after DNS validates before the "Enforce HTTPS" option even becomes available. Apex domains have several documented gotchas (stray DNS records blocking cert issuance, CAA record conflicts, wildcard-DNS subdomain-takeover risk) that don't apply to subdomain-only setups. Elvis's domain is currently on GoDaddy DNS (`ns17`/`ns18.domaincontrol.com`) with the apex `A` record pointed at an EC2 IP (`52.52.58.114`) and `www` as a `CNAME` to the apex — both will need to change as part of cutover.

## The `CNAME` file

- GitHub Pages uses a plain-text file literally named `CNAME` (no extension) at the root of whatever is published (repo root, `/docs` folder, or `gh-pages` branch root, depending on Pages source config) containing just the domain, e.g. `elvislee.com`.
- If the custom domain is set via the repo's Settings -> Pages UI, GitHub creates/commits this file automatically.
- Exception: if publishing via a custom GitHub Actions workflow (rather than the classic branch-based Pages source), GitHub does **not** auto-create or require a `CNAME` file — the custom domain is instead just configured in Pages settings directly. This is a build-pipeline decision the Architect/Developer role will need to make (classic branch deploy vs. Actions-based deploy), since it changes whether a `CNAME` file needs to exist in the repo at all.

## DNS records needed

**Apex (`elvislee.com`)** — pick one:
- **A records** (recommended, works everywhere) pointing to all four of GitHub Pages' IPs:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **AAAA records** (IPv6, optional/additional) — GitHub recommends pairing these with the A records rather than using AAAA alone, due to incomplete IPv6 adoption:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- **ALIAS/ANAME record** (if the DNS provider supports this record type at the zone apex — GoDaddy's support for this is inconsistent/plan-dependent and should be verified directly) pointing to `<username>.github.io`, as an alternative to the four A records.

**`www` subdomain** — a `CNAME` record pointing `www.elvislee.com` to `<username>.github.io` (i.e., `ElvisLee0725.github.io` — the GitHub Pages default domain, **without** a repo-name path).

**Primary vs. redirect**: whichever of `elvislee.com` or `www.elvislee.com` is entered as the custom domain in the repo's Pages settings becomes the "primary" — GitHub then automatically redirects the other to it, *provided both sets of DNS records above are in place*. (E.g., set the apex as primary -> `www.elvislee.com` auto-redirects to `elvislee.com`, and vice versa.) This needs an explicit decision: does Elvis want the canonical URL to be `elvislee.com` or `www.elvislee.com`? The legacy site's footer text says "www.elvislee.com" but the live-demo/homepage URL in the repo's `package.json`/README is `https://elvislee.com` (no www) — i.e., the legacy app itself is inconsistent about which is canonical, so this isn't answered by precedent and should be a deliberate choice for this migration.

## Current DNS state observed (as of this audit, via public `dig` lookups — not Elvis's registrar panel)

- `elvislee.com` A record -> `52.52.58.114` (consistent with an AWS EC2 public IP; presumably the current EC2 instance).
- `www.elvislee.com` -> `CNAME` -> `elvislee.com.` (i.e., www currently follows the apex, not pointed at GitHub or anywhere independently).
- Nameservers: `ns17.domaincontrol.com` / `ns18.domaincontrol.com` — these are **GoDaddy** nameservers, so DNS is managed through GoDaddy (registrar and/or DNS host), which is where the record changes below will need to be made.
- No `CAA` record currently present at the apex — this is good news for the migration: an absent CAA record means no CA is restricted, so Let's Encrypt (which GitHub Pages uses for its automatic certs) won't be blocked by an existing CAA policy. If one is ever added, it must include an entry permitting `letsencrypt.org`.
- Live reachability of `https://elvislee.com` could not be independently confirmed in this sandbox (outbound HTTPS/HTTP to the live site both timed out under the tooling's network restrictions) — this is a tooling limitation, not a finding about the site's actual uptime, and should be spot-checked directly by a human or a less-restricted environment before relying on it.

## HTTPS / certificate provisioning timing

1. Custom domain is entered in GitHub repo Settings -> Pages (or via committed `CNAME` file for classic branch deploys).
2. GitHub runs a DNS check against the records above.
3. Once DNS validates, GitHub queues a TLS certificate request through Let's Encrypt.
4. The "Enforce HTTPS" checkbox in Pages settings only becomes selectable once that certificate is issued and attached — **GitHub's own docs say this can take up to 24 hours** after DNS is correctly configured. DNS propagation itself can separately take up to 24 hours depending on the previous record TTLs.
5. Until "Enforce HTTPS" is both available and turned on, the site may still serve over plain HTTP or show a certificate mismatch — this window should be planned for (i.e., don't flip the DNS cutover and expect HTTPS instantly).

## Apex-domain-specific gotchas (from GitHub's own documentation and community troubleshooting threads)

- **Stray/extra DNS records block cert issuance.** Any additional A/AAAA/ALIAS/ANAME record at the apex beyond GitHub's four IPs (e.g., a leftover record from the old EC2 setup), or any extra CNAME at `www` beyond the one pointing to `<username>.github.io`, can prevent GitHub from issuing the certificate. The old EC2 `A` record (`52.52.58.114`) must be fully removed, not just supplemented.
- **CAA record conflicts** — covered above; not currently a problem, but must stay Let's Encrypt-permissive if a CAA record is ever added.
- **Configure GitHub before DNS, not after.** GitHub's docs explicitly warn that pointing DNS at GitHub Pages infrastructure *before* registering the custom domain in the repo's Pages settings can let someone else claim/host content on that subdomain in the window before it's claimed. Sequence matters: add the custom domain in GitHub settings first, then update DNS (or do both close together, but don't leave DNS pointed at GitHub with the domain unclaimed in Pages settings).
- **No wildcard DNS records** (e.g., `*.elvislee.com`) — GitHub strongly warns against these due to subdomain-takeover risk; not currently present per the CAA/record check above, but worth confirming no wildcard exists before cutover, especially since `scp.elvislee.com`, `flashcard.elvislee.com`, and `fun-searcher.elvislee.com` subdomains are referenced as live project URLs in `client/components/project.jsx` — these are a separate DNS concern from the apex Pages migration but live in the same DNS zone and should not be accidentally disrupted by apex-record changes.
- **www pointed at apex instead of at GitHub directly** can itself cause HTTPS enforcement failures or the subdomain simply not resolving to the Pages site — reinforcing that `www` needs its own direct `CNAME` to `<username>.github.io`, not a `CNAME`/`A` record chained through the apex (which is actually how the *current* legacy DNS is set up: `www` -> apex; this exact pattern is called out by GitHub as a known failure mode and must change during migration).

## Open questions for PM / Architect

1. Which domain is canonical: `elvislee.com` (apex) or `www.elvislee.com`? (Legacy repo is internally inconsistent on this — footer says www, README/package homepage says apex.)
2. Which Pages publish source will be used — classic branch-based (`CNAME` file required, auto-managed by GitHub settings) or a custom GitHub Actions workflow (no `CNAME` file, domain configured purely via settings)? This affects whether Developer needs to commit a `CNAME` file at all.
3. Confirm with Elvis directly (registrar-panel access needed, not available in this audit) exactly what other DNS records currently exist in the GoDaddy zone for `elvislee.com` — particularly whether any stray apex records beyond the single `A` record found here would need cleanup, and to confirm the `scp./flashcard./fun-searcher.` project subdomains are not affected by the apex record changes.
4. Plan/communicate a maintenance window or at least a "don't expect instant HTTPS" expectation for the cutover, given the up-to-24-hour DNS propagation + up-to-24-hour cert issuance windows can stack.
