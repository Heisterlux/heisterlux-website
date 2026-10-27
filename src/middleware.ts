import { defineMiddleware } from 'astro:middleware';

/**
 * Security headers for on-demand (server-rendered) responses. Prerendered pages get the same
 * headers from vercel.json plus Astro's CSP via the adapter's staticHeaders option.
 */
const HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
};

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (context.isPrerendered) return response;
  for (const [k, v] of Object.entries(HEADERS)) {
    if (!response.headers.has(k)) response.headers.set(k, v);
  }
  return response;
});
