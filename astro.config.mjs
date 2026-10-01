// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Canonical production origin. Previews and DEV are never indexable (see src/config/site.ts).
const SITE = 'https://heisterlux.com';

// `astro dev` injects styles inline through Vite, which a strict CSP blocks. The CSP is applied to
// every build (the deployable artifact) and verified by scripts/verify-dist.ts; only the local
// dev server runs without it.
const IS_DEV_SERVER = process.argv.includes('dev');

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  output: 'static',
  adapter: vercel({
    // Send Astro's generated CSP (with exact script/style hashes) as a real HTTP header
    // for prerendered pages instead of only a <meta> element.
    staticHeaders: true,
    webAnalytics: { enabled: false },
    imageService: false,
  }),
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  // Locale-neutral root goes to the English home. No geolocation, no cookies.
  redirects: {
    '/': { status: 302, destination: '/en/' },
  },
  security: {
    checkOrigin: true,
    csp: IS_DEV_SERVER ? false : {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  devToolbar: { enabled: false },
  // No Markdown is rendered; disabling highlighting avoids Shiki's inline styles entirely.
  markdown: { syntaxHighlight: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
