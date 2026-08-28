# Campbell Downs — Design & Analysis

Live site: [www.campbelldowns.com](http://www.campbelldowns.com)

Static site for [Campbell Downs](mailto:campbellndowns@gmail.com), Purdue School of Aeronautics and Astronautics. Content and figures are taken from the CAD portfolio deck (`assets/Campbell-Downs-CAD-Portfolio.pdf`).

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish on GitHub Pages

1. Merge this branch to `main`.
2. In the repo: **Settings → Pages**.
3. Set source to **GitHub Actions**.
4. Set the custom domain to **`www.campbelldowns.com`** (must match the `CNAME` file). Do not save `campbelldowns.com` here — GitHub already maps the apex as the alternate name.
5. After GitHub’s DNS check turns green, enable **Enforce HTTPS**.

Until HTTPS is issued, the site is already served over HTTP at `http://www.campbelldowns.com` (and `http://campbelldowns.com` redirects there).

## DNS for campbelldowns.com

Public DNS is already pointed at GitHub Pages. As of 2026-08-28:

| Name | Type | Value |
| --- | --- | --- |
| `@` / `campbelldowns.com` | A | 185.199.108.153, .109.153, .110.153, .111.153 |
| `@` / `campbelldowns.com` | AAAA | 2606:50c0:8000::153 through 8003::153 |
| `www` | CNAME | `campbellndowns-collab.github.io` |

Nameservers are Squarespace (`nse1`–`nse4.squarespacedns.com`). Google Public DNS returns those records from the authoritative servers.

`InvalidDNSError` and “both www.campbelldowns.com and campbelldowns.com are improperly configured” are **GitHub’s checker failing to retrieve DNS**, not missing A/CNAME records. GitHub treats that error as “lookup empty/timeout,” which is why Enforce HTTPS stays grayed out even though HTTP already works.

### What still needs to happen in Squarespace and GitHub

1. **Squarespace DNS panel** — delete leftover Squarespace website defaults. Extra records block GitHub’s HTTPS certificate even when the GitHub records also exist. Remove any of these if present:
   - A records to `198.49.23.144`, `198.49.23.145`, `198.185.159.144`, `198.185.159.145`
   - `www` CNAME to `ext-cust.squarespace.com` or any Squarespace host
   - URL forwarding / domain forwarding
   - A Squarespace site connected to this domain
2. **GitHub custom domain reset** (this is the usual fix once records are correct):
   - Repo **Settings → Pages → Custom domain** → remove `www.campbelldowns.com`
   - Wait 10–15 minutes
   - Add **`www.campbelldowns.com`** and Save
   - Leave Enforce HTTPS unchecked until the DNS check shows a green check
3. **Verify the domain on your GitHub account** (optional but helps): [github.com/settings/pages_verified_domains](https://github.com/settings/pages_verified_domains) → add `campbelldowns.com` → put the `_github-pages-challenge-campbellndowns-collab` TXT record in Squarespace → verify
4. If the red InvalidDNSError is still there after a re-add, wait out GitHub’s cache (often several hours). The records do not need to be changed again.
5. Last resort: move DNS to Cloudflare (same A/AAAA/CNAME values, DNS only / grey cloud) or open a GitHub Support ticket. Public resolvers already see the correct GitHub records.

Do not add a CNAME at the apex. Do not point `www` at `campbellndowns-collab.github.io/CampbellDowns_Portfolio` — the CNAME target is the hostname only.

## Site map

- `resume.html` — résumé viewer. Add `assets/resume.pdf`, or set `resumePdf` / `resumeOverleaf` in `js/site-config.js`. Overleaf has no public live-PDF URL, so the compiled file has to be published somewhere the site can load.
- `work/fitness-rack.html`
- `work/bike-horn-mount.html`
- `work/double-wall-mug.html`
- `work/pull-up-bar.html`
