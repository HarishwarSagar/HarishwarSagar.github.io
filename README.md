# Harishwar Sagar — Portfolio

Personal portfolio for **Harishwar Sagar**, Revenue Operations & GTM professional.
A single-file, zero-dependency static site — vibrant editorial light theme (cream paper, ink, flame→rose→amber gradient), kinetic typography, animated logo belt, sticky-stack experience cards. Built for GitHub Pages.

## What's in here

| File | Purpose |
|---|---|
| `index.html` | The entire website — HTML, CSS and JS in one file |
| `Harishwar_Sagar_GTM_RevOps_Resume.pdf` | Résumé served by the "Download résumé" buttons |
| `README.md` | This file |

## Deploy to GitHub Pages (5 minutes)

1. Create a new repository on GitHub.
   - For `https://<username>.github.io` → name the repo exactly `<username>.github.io`
   - For `https://<username>.github.io/portfolio` → name it anything (e.g. `portfolio`)
2. Upload **all three files** to the repo root (drag-and-drop on github.com works, or `git push`).
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → Save.
4. Wait ~1 minute. Your site is live.

### Custom domain (harishwarsagar.com)

1. In **Settings → Pages → Custom domain**, enter `harishwarsagar.com` and save (this creates a `CNAME` file).
2. At your DNS provider, add:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `<username>.github.io`
3. Tick **Enforce HTTPS** once the certificate is issued.

## Updating content

Everything is in `index.html`, organized by commented sections (`HERO`, `01 · NUMBERS`, `02 · APPROACH`, `03 · EXPERIENCE`, `04 · STACK`, `05 · EDUCATION`, `06 · CONTACT`). Design tokens (colors, fonts) live in the `:root` block at the top of the stylesheet.

To update the résumé, replace the PDF **keeping the same filename**, or update the two `href="Harishwar_Sagar_GTM_RevOps_Resume.pdf"` links.
