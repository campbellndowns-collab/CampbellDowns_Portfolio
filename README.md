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

- `resume.html` — résumé as a page (not a PDF viewer). Source file is `assets/resume.pdf`; after Overleaf edits, replace that PDF. `assets/resume.png` is a static fallback.
- `work/fitness-rack.html`
- `work/bike-horn-mount.html`
- `work/double-wall-mug.html`
- `work/pull-up-bar.html`
