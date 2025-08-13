// Central place to build API URLs dynamically
// Domain (host) is read from environment variable so it can change per environment.
// Endpoints are defined separately so you never hardcode full URLs in components/services.

// Public env var: define in .env.local as NEXT_PUBLIC_API_DOMAIN=https://your-domain
// Fallback defaults to production backend if env not provided.
const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || 'https://portfolio-be-nes-js.onrender.com';

// API version header value
export const API_VERSION = 2;

// Shared API prefix (adjust if backend changes)
const API_PREFIX = '/api';

// Endpoint path builders (no domain). Keep pure path logic here.
export const paths = {
  portfolio: {
    user: () => `${API_PREFIX}/portfolio/user`, // e.g. GET user portfolio
    userById: (id: string) => `${API_PREFIX}/portfolio/user/${id}`,
  },
};

// Helper to compose full URL with domain
export function apiUrl(path: string) {
  return `${API_DOMAIN}${path}`;
}

// Example: apiUrl(paths.portfolio.user())
// Result: https://<domain>/api/portfolio/user

// Optional: expose domain separately if needed elsewhere
export const apiDomain = API_DOMAIN;
