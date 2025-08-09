import { createClient, RedisClientType } from "redis";

class RedisConnection {
  private client: RedisClientType;
  private static instance: RedisConnection;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err: Error) => {
      console.error("Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });

    this.client.on("disconnect", () => {
      console.log("Disconnected from Redis");
    });
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  // public async disconnect(): Promise<void> {
  //   if (this.client.isOpen) {
  //     await this.client.disconnect();
  //   }
  // }

  public getClient(): RedisClientType {
    return this.client;
  }

  // Utility methods
  public async set(
    key: string,
    value: string,
    expireInSeconds?: number
  ): Promise<void> {
    if (expireInSeconds) {
      await this.client.setEx(key, expireInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  public async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  public async setJSON(
    key: string,
    value: any,
    expireInSeconds?: number
  ): Promise<void> {
    const jsonString = JSON.stringify(value);
    await this.set(key, jsonString, expireInSeconds);
  }

  public async getJSON(key: string): Promise<any | null> {
    const jsonString = await this.get(key);
    return jsonString ? JSON.parse(jsonString) : null;
  }
}

// Create and export the singleton instance
const redisConnection = RedisConnection.getInstance();

export default redisConnection;
export { RedisConnection };
