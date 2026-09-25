# Мои таблетки (Daily Pill Reminder)

A single-page app to keep a personal list of pills, check them off each day, and get a small
celebration with a cat photo when all of today's pills are taken.

- **Framework:** Nuxt 3 (statically generated), no server runtime.
- **Hosting:** GitHub Pages (project site: `https://<user>.github.io/pill-app/`).
- **Persistence:** browser `localStorage` only — data lives on one device/browser and is lost if
  site data is cleared or the browser/device changes.
- **Language:** UI text is in Russian.

## Development

```bash
npm install
npm run dev      # dev server on http://localhost:3000
npm run generate # static build to .output/public
npm run preview  # preview the static build
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static site and
publishes it to GitHub Pages. In the repo settings, set the Pages source to **GitHub Actions**.

## Cat photo credits

Celebration cat photos are free-license stock images, one per weekday:

| File | Source | Photographer |
|---|---|---|
| `monday.jpg` | [Pexels](https://www.pexels.com/photo/selective-focus-photography-of-orange-tabby-cat-1170986/) | kowalievska |
| `tuesday.jpg` | [Unsplash](https://unsplash.com/photos/black-cat-7XJ3d0xK444) | Jeff Tumale |
| `wednesday.jpg` | [Pexels](https://www.pexels.com/photo/a-close-up-shot-of-a-white-cat-12968851/) | Pexels |
| `thursday.jpg` | [Pexels](https://www.pexels.com/photo/gray-cat-sitting-indoors-looking-out-window-32640080/) | Pexels |
| `friday.jpg` | [Unsplash](https://unsplash.com/photos/siamese-cat-lying-on-wooden-table-ZY97RvOiAOA) | Unsplash |
| `saturday.jpg` | [Pexels](https://www.pexels.com/photo/fluffy-gray-cat-sitting-on-soft-bed-8117226/) | Pexels |
| `sunday.jpg` | [Unsplash](https://unsplash.com/photos/a-close-up-of-a-black-cat-near-a-potted-plant-3Oj7ziv_m5Y) | Anastasia Nevetskaya |

Used under the [Pexels License](https://www.pexels.com/license/) and the
[Unsplash License](https://unsplash.com/license).