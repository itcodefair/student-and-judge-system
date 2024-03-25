/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 */
export const publicRoutes = ["/auth"];

/**
 * An array of routes that are used for auth
 * These routes will redirect logged in users to /home
 */
export const authRoutes = ["/auth"];

/**
 * The prefix for API authentication routes
 */
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";
