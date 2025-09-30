import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY environment variable is required");
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Genera un token JWT
 */
export const generateToken = (
  payload: Omit<JWTPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

/**
 * Verifica y decodifica un token JWT
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};

/**
 * Decodifica un token sin verificar (para debugging)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};
