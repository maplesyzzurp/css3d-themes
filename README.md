# CSS 3D Themes — Showcase

Eight 3D themes for the chat app, built with Next.js (App Router) + pure CSS 3D transforms. No external 3D library — just `perspective`, `transform-style: preserve-3d`, and a little JS math for projection.

## Themes

1. **Neon Cyberpunk** — dark void, cyan/magenta glow, scanlines
2. **Glassmorphism** — frosted translucent nodes, pastel gradients
3. **Terminal** — green monospace, CRT flicker
4. **Aurora** — shifting green/purple sky
5. **Synthwave** — purple-orange sunset, pink grid floor
6. **Minimal Dark** — charcoal, thin lines, no clutter
7. **Cosmic** — starfield, nodes as planets
8. **Blueprint** — off-white, navy ink, dashed edges

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Drag the graph to rotate; it auto-spins when idle. Click a theme chip to switch.

## Deploy

Push to this repo and connect it to Vercel — it's a standard Next.js app, zero config.
