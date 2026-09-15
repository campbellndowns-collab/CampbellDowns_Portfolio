# Campbell Downs — Design & Analysis

Live site: [www.campbelldowns.com](https://www.campbelldowns.com)

Static site for [Campbell Downs](mailto:campbellndowns@gmail.com), Purdue School of Aeronautics and Astronautics. Content and figures are taken from the CAD portfolio deck (`assets/Campbell-Downs-CAD-Portfolio.pdf`).

The custom domain is hosted on **Vercel**. Do not add `campbelldowns.com` or `www.campbelldowns.com` back under GitHub Pages → Custom domain. That makes browsers hit GitHub’s `*.github.io` certificate and show `ERR_CERT_COMMON_NAME_INVALID`. GitHub Actions may still publish a backup at `https://campbellndowns-collab.github.io/CampbellDowns_Portfolio/`.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish

Production is Vercel. Merge to `main` and Vercel deploys automatically if the GitHub repo is connected.

GitHub Pages is only a backup. Leave **Custom domain** empty in the repo Pages settings.

## DNS

Nameservers are Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Manage records in the Vercel project domain settings. Do not point the apex or `www` back at GitHub Pages IPs.

## Site map

- `traffic.html` — first-party traffic dashboard (noindex). Pageviews and key interactions via `/api/traffic`.
- `resume.html` — résumé as a page (not a PDF viewer). Source file is `assets/resume.pdf`; after Overleaf edits, replace that PDF. `assets/resume.png` is a static fallback.
- `work/project-echo.html` — Project ECHO agricultural survey drone case study (ongoing). Place CAD renders in `assets/images/project-echo/` and the interactive model at `assets/models/project-echo.glb`.
- `work/fitness-rack.html`
- `work/bike-horn-mount.html`
- `work/double-wall-mug.html`
- `work/pull-up-bar.html`

## Traffic

The site records lightweight first-party events (pageviews, project opens, resume/email/LinkedIn clicks, 50% scroll). Open `/traffic.html` for the dashboard.

For durable storage on Vercel: Project → Storage → create a **KV** database. That injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Until then, events only persist on warm serverless instances.

Optional: enable **Vercel Web Analytics** in the project for the built-in Vercel dashboard (script loads automatically on campbelldowns.com).
