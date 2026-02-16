# AI Colleagues Homepage

Astro-based static website for AI Colleagues, deployed to GitHub Pages with custom domain `ai-colleagues.com`.

## Active Structure

- `src/pages/index.astro`: landing page
- `src/pages/blog/*`: blog list and Markdown post pages
- `src/pages/news/index.astro`: news landing page
- `src/content/blog/*.md`: blog content
- `public/assets/*`: downloadable static assets
- `public/CNAME`: GitHub Pages custom domain

## Legacy and Archived Files

- `legacy/site-v1/`: previous plain HTML/CSS/JS homepage
- `legacy/theme-unused/`: unused files imported from the starter theme

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Contact Form Configuration

The contact form uses Web3Forms. You can override the key via:

- `PUBLIC_WEB3FORMS_ACCESS_KEY`

Example:

```bash
PUBLIC_WEB3FORMS_ACCESS_KEY=your-key npm run dev
```
