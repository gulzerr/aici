import { Request, Response, NextFunction } from "ultimate-express";
import { RedisConnection } from "../../utils/redis";

export async function verifyToken(token: string) {
  const rediskey = `user_token:${token}`;
  const userData = await RedisConnection.getInstance().get(rediskey);
  if (!userData) {
    return null;
  }
  return JSON.parse(userData);
}

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = extractAuthorizationToken(req);
    if (!token) {
      return res.status(401).json({ isError: true, message: "Unauthorized" });
    }

    const user = await verifyToken(token);
    if (!user) {
      return res.status(401).json({ isError: true, message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    const err = error as Error & { status?: number };
    return res.status(err.status || 500).json({
      isError: true,
      message: err.message,
    });
  }
}

export function extractAuthorizationToken(req: Request) {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    return token;
  }

  const authorizationHeader =
    req.get("Authorization") || req.get("X-Access-Token");
  if (authorizationHeader) {
    return authorizationHeader.replace(/Bearer +/i, "");
  }

  return null;
}
