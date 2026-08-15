# elvislee-website-2026

Migration of Elvis Lee's personal one-page portfolio site from the legacy
[elvislee-website-react-2020](https://github.com/ElvisLee0725/elvislee-website-react-2020)
stack (React + Express, hosted on AWS EC2) to a static site hosted free on
GitHub Pages at the custom domain **elvislee.com**.

## Why

- EC2 hosting has been abandoned — this project removes the Express server
  layer entirely and moves to a static build.
- The old SendGrid-backed contact form has drawn essentially no genuine
  inquiries over the years; the contact method is being reconsidered as part
  of this migration rather than lifted-and-shifted as-is.

## Workflow

This repo uses four project-scoped subagents (`.claude/agents/`) to work
through the migration in stages:

1. **analysis** — audits the legacy repo and researches hosting/contact-method
   options. Read-only, produces findings in `docs/analysis-*.md`.
2. **pm** — turns findings into scope, milestones, and a contact-method
   decision in `docs/requirements.md`.
3. **architect** — turns requirements into a concrete technical design in
   `docs/architecture.md` (build tooling, repo layout, GitHub Pages/DNS/CI
   setup, contact-method integration).
4. **developer** — implements the design: migrates legacy content, strips
   server-side code, wires up GitHub Actions deploy to Pages, and implements
   the contact method.

## Status

Project scaffolded. No milestones started yet.
