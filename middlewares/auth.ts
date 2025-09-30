import { Request, Response, NextFunction } from "express";
import { verifyToken, JWTPayload } from "../lib/jwt.js";

/**
 * JWT Authentication Middleware
 *
 * Token can be sent in two ways:
 * 1. In cookies: req.cookies.access_token (priority)
 * 2. In Authorization header: "Bearer <token>"
 *
 * This allows flexibility for different client types:
 * - Web browsers: use cookies automatically
 * - APIs/Mobile: can use Authorization headers
 */

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// List of routes that do NOT require authentication
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/test-db",
  "/", // Root route
];

// List of routes that can use wildcards
const PUBLIC_ROUTE_PATTERNS = [
  /^\/api\/auth\/(login|register)$/,
  /^\/$/,
  /^\/api\/test-db$/,
];

/**
 * JWT Authentication Middleware
 * Protects all routes except those defined as public
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { path } = req;

  // Check if route is public (exact match)
  if (PUBLIC_ROUTES.includes(path)) {
    return next();
  }

  // Check if route is public (patterns)
  if (PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(path))) {
    return next();
  }

  // Get token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7) // Remove 'Bearer ' from start
      : null;

  const tokenFromCookie = req.cookies?.access_token;

  // Prioritize token from cookies, then from header
  const token = tokenFromCookie || tokenFromHeader;

  // If no token, return 401 error
  if (!token) {
    res.status(401).json({
      error: "Access token required",
      message: "You must provide a valid access token to access this resource",
    });
    return;
  }

  try {
    // Verify and decode token
    const decoded = verifyToken(token);

    // Add user information to request object
    req.user = decoded;

    // Continue to next middleware
    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Token verification failed";

    // Determine status code based on error type
    let statusCode = 401;
    if (errorMessage === "Token expired") {
      statusCode = 401;
    } else if (errorMessage === "Invalid token") {
      statusCode = 403;
    }

    res.status(statusCode).json({
      error: "Authentication failed",
      message: errorMessage,
    });
    return;
  }
};

/**
 * Optional middleware that adds user information if valid token exists
 * but does not require authentication
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const tokenFromCookie = req.cookies?.access_token;

  // Prioritize token from cookies, then from header
  const token = tokenFromCookie || tokenFromHeader;

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Simply ignore errors in optional auth
      req.user = undefined;
    }
  }

  next();
};
