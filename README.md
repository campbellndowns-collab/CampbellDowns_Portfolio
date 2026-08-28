# Campbell Downs — Engineering Design Portfolio

Static site for [Campbell Downs](mailto:campbellndowns@gmail.com), Purdue Aerospace Engineering. Content and figures are taken from the CAD portfolio deck (`assets/Campbell-Downs-CAD-Portfolio.pdf`).

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish on GitHub Pages

1. Merge this branch to `main`.
2. In the repo: **Settings → Pages**.
3. Set source to **GitHub Actions** (this repo includes `.github/workflows/pages.yml`).
4. After the workflow succeeds, the site is at:
   `https://campbellndowns-collab.github.io/CampbellDowns_Portfolio/`

## Point a personal domain at the site

The site uses relative URLs, so it works at the root of any domain.

1. In **Settings → Pages → Custom domain**, enter your domain (for example `campbelldowns.com` or `www.campbelldowns.com`).
2. At your registrar, add DNS records:

**Apex domain** (`campbelldowns.com`):

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

**www subdomain:**

| Type | Name | Value |
| --- | --- | --- |
| CNAME | www | campbellndowns-collab.github.io |

3. Wait for DNS to propagate, then enable **Enforce HTTPS** on the Pages settings screen.
4. Optional: add a `CNAME` file in this repo containing only your domain name. GitHub often creates this file automatically when you save the custom domain.

If you reply with the exact domain you already own, the `CNAME` file can be committed for you.

## Site map

- `index.html` — profile, selected work, skills, contact
- `work/fitness-rack.html`
- `work/bike-horn-mount.html`
- `work/double-wall-mug.html`
- `work/pull-up-bar.html`
