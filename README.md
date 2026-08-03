# Portfolio frontend

Next.js portfolio with server-rendered public data and a protected admin editor.

## Local setup

Copy `.env.example` to `.env.local` and configure every value. No development
credential or production-host fallback exists; missing security configuration
fails closed.

```bash
npm install
npm run dev
```

Required server-only variables:

- `API_BASE_URL`: backend origin. Never prefix this with `NEXT_PUBLIC_`.
- `RESUME_SOURCE_URL`: HTTPS source used only by the same-origin resume route.
- `ADMIN_LOGIN_EMAIL`: admin sign-in identity.
- `ADMIN_LOGIN_PASSWORD`: strong, unique password with at least 12 characters.
- `ADMIN_SESSION_SECRET`: random secret with at least 32 characters.
- `ADMIN_API_SECRET`: backend admin API key with at least 16 characters.
- `CRON_SECRET`: random bearer token with at least 16 characters.

Use different secrets per environment. Rotate them after suspected exposure and
protect production environment access with MFA.

## Security boundary

- Public pages fetch backend data only in server components.
- Public DTO mapping uses an explicit allowlist before data reaches HTML/RSC.
- Admin API keys and session-signing keys are guarded by `server-only` imports.
- Admin writes require a signed HttpOnly cookie, same-origin request, bounded
  JSON body, validation, and login throttling.
- Portraits are bundled into immutable deployment assets; no third-party image
  origin is contacted by visitors.
- CSP, framing, MIME-sniffing, referrer, permissions, and transport headers are
  set at the frontend boundary. Browser source maps stay disabled in production.

The bounded in-process login limiter is defense in depth. On Vercel it keys from
Vercel's protected forwarded-IP header; elsewhere it deliberately groups clients
instead of trusting spoofable proxy headers. Production still needs a WAF or
distributed limiter at the deployment boundary.

Browser-visible HTML, CSS, JavaScript, displayed data, and image bytes cannot be
secret. Minification is not authorization. Protection comes from keeping write
credentials server-side and rejecting unauthorized mutation requests.

The backend must independently enforce:

- GET-only public portfolio routes with a minimal public response DTO.
- Authentication and authorization on every PUT/PATCH/POST/DELETE route.
- Record ownership checks, transaction boundaries, audit history, and backups.
- Restricted CORS on admin routes. CORS must never be treated as authentication.
- Database credentials and network controls unavailable to browsers.
- Distributed rate limiting for production login traffic.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```
