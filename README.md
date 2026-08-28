# Campbell Downs — Engineering Design Portfolio

Live site: [campbelldowns.com](https://campbelldowns.com)

Static site for [Campbell Downs](mailto:campbellndowns@gmail.com), Purdue Aerospace Engineering. Content and figures are taken from the CAD portfolio deck (`assets/Campbell-Downs-CAD-Portfolio.pdf`).

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish on GitHub Pages

1. Merge this branch to `main`.
2. In the repo: **Settings → Pages**.
3. Set source to **GitHub Actions**.
4. Confirm the custom domain is `campbelldowns.com` (this repo includes a `CNAME` file).
5. After DNS is in place, enable **Enforce HTTPS**.

Until DNS is pointed at GitHub, GitHub Pages may also serve the site at:
`https://campbellndowns-collab.github.io/CampbellDowns_Portfolio/`

## DNS for campbelldowns.com

At the registrar that owns `campbelldowns.com`, set these records. Remove any old A/AAAA/CNAME records for `@` and `www` that point somewhere else.

**Apex (`campbelldowns.com`):**

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

**www (`www.campbelldowns.com`):**

| Type | Name | Value |
| --- | --- | --- |
| CNAME | www | campbellndowns-collab.github.io |

DNS can take a few minutes to a few hours. After GitHub shows the domain as verified, check **Enforce HTTPS**.

## Site map

- `index.html` — profile, selected work, skills, contact
- `work/fitness-rack.html`
- `work/bike-horn-mount.html`
- `work/double-wall-mug.html`
- `work/pull-up-bar.html`
