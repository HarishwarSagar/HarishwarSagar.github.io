# harishwarsagar.com — Portfolio

A fast, single-page, hand-coded portfolio (HTML + CSS + vanilla JS). No build step. Hosted free on **GitHub Pages** with the custom domain `harishwarsagar.com`.

## Structure
```
website/
├── index.html         # the site
├── css/styles.css     # dark "operator" theme
├── js/main.js         # nav, scroll-reveal, lightbox, Cal embed hooks
├── assets/            # your images go here (see assets/README.md)
├── resume/            # downloadable résumé PDF
├── CNAME              # custom domain for GitHub Pages
├── 404.html           # custom not-found page
├── robots.txt, sitemap.xml, favicon.svg
```

## Deploy to GitHub Pages (one-time)
1. Create a **new GitHub repo** named `harishwarsagar.github.io` (public).
2. Upload **the contents of this `website/` folder** to the repo root (not the folder itself — the `index.html` must be at the repo root).
3. In the repo: **Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` / root → Save.**
4. The `CNAME` file already sets the domain. In **Settings → Pages → Custom domain**, confirm `harishwarsagar.com` shows, then tick **Enforce HTTPS** (after DNS verifies, may take a few minutes to an hour).

## DNS (at your domain registrar)
Point the domain at GitHub Pages:

**Apex (`harishwarsagar.com`) — four A records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
(Optionally also add the AAAA/IPv6 records GitHub lists in its docs.)

**`www` subdomain — one CNAME record:**
```
www  →  harishwarsagar.github.io
```
DNS can take 10 minutes to a few hours to propagate. Then enable **Enforce HTTPS**.

## Update later
Edit the files and push — GitHub Pages redeploys automatically in ~1 minute.

## Booking
The "Book a call" buttons use the official Cal.com embed pointed at `cal.com/harishwar` (popup + inline calendar in the Contact section).
