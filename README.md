# Sell.Art

A simple portfolio + shop website for selling digital art made in Procreate.
No build tools: plain HTML, CSS and JavaScript.

**Sections:** hero · gallery (with tag filters and a click-to-enlarge lightbox) · shop links · commissions (pricing + request form) · about.

## Make it yours

Edit just two files:

| File | What to change |
|---|---|
| `js/config.js` | Your name, tagline, about text, contact email, shop links (Redbubble, Etsy, INPRNT…), socials, commission prices, open/closed |
| `js/artworks.js` | Your artworks: title, image, description, price, and links to buy prints / downloads |

Any link left as `""` is hidden automatically, so the site looks finished even before your shops are set up.

### Adding a new artwork

1. In Procreate: **Actions → Share → JPEG** (or PNG). Around 2000 px wide is plenty for the web.
2. Put the file in `assets/art/`.
3. Copy the example block in `js/artworks.js`, fill it in, and put it at the top (newest first). The newest piece also becomes the big hero image.

> Upload your **full-resolution** files to print shops (Redbubble, INPRNT etc.), not here. The website only needs web-sized images, which also makes them less useful to anyone trying to copy them.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## Publish free with GitHub Pages

1. Merge into the `main` branch.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root → Save**.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Commission form

The form opens the visitor's email app with their request pre-filled and addressed to the `email` in `config.js`.
If you'd rather receive submissions without exposing your email, a free service like Formspree can be plugged in later.

## Licensing

- **Website code** (`index.html`, `css/`, `js/`) is released under the MIT License (see `LICENSE`).
- **Artwork** (everything in `assets/art/`) is **© the artist, all rights reserved**. It is *not* covered by the MIT License and may not be copied, reused or sold without permission.
