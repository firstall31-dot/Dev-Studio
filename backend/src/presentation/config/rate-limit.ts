import rateLimit from "express-rate-limit";

// Global limiter: restricts every IP to 1000 requests per 15 minutes.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for Auth endpoints (e.g., login/register) to prevent brute force
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again after an hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
