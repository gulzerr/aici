import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { Request } from "ultimate-express";
import { UserInterface } from "./types";
import { comparePassword, hashPassword } from "./utils";
import { createOrReturnTransaction } from "../../utils/utils";
import { RedisConnection } from "../../utils/redis";
import { extractAuthorizationToken } from "../auth/security";

export async function registerUser(userData: UserInterface) {
  const { first_name, last_name, email, password, tx } = userData;
  const newUser = await createOrReturnTransaction(tx, async (transaction) => {
    const hashedPassword = await hashPassword(password);

    const emailExists = await transaction.users.findUnique({
      where: {
        user_email: email,
      },
      select: {
        id: true,
      },
    });

    if (emailExists) {
      const error: any = new Error("Email already exists.");
      error.status = 409;
      throw error;
    }

    const user = await transaction.users.create({
      data: {
        first_name: first_name,
        uuid: uuidv4(),
        last_name: last_name,
        user_email: email,
        user_pwd: hashedPassword.hash,
        salt: hashedPassword.salt,
        status: "active",
      },
    });
    return user;
  });

  return newUser;
}

export async function login(opts: { email: string; password: string }) {
  const { email, password } = opts;
  return await createOrReturnTransaction(null, async (transaction) => {
    const user = await transaction.users.findFirst({
      where: {
        user_email: email,
      },
      select: {
        id: true,
        user_pwd: true,
        salt: true,
        uuid: true,
      },
    });

    if (!user) {
      const error: any = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    const match = await comparePassword(password, user.salt, user.user_pwd);
    if (!match) {
      const error: any = new Error("Invalid credentials");
      error.status = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    const redisKey = `user_token:${token}`;
    await RedisConnection.getInstance().set(
      redisKey,
      JSON.stringify({ id: user.id, uuid: user.uuid }),
      24 * 60 * 60
    );

    return token;
  });
}

//write logout function that removes the token from redis
export async function logout(req: Request) {
  const token = extractAuthorizationToken(req);
  if (!token) {
    throw new Error("No token provided");
  }

  const redisKey = `user_token:${token}`;
  const result = await RedisConnection.getInstance().del(redisKey);
  if (result === 0) {
    throw new Error("Token not found");
  }
  return { message: "Logged out successfully" };
}
