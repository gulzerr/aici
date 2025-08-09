import express from "ultimate-express";
import bodyParser from "body-parser";
import cors from "cors";
import { errors as celebrateErrors } from "celebrate";
import prisma from "./utils/db";
import morganBody from "morgan-body";
import userCtrl from "./controllers/user";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();

app.use(bodyParser.json());
morganBody(app, {
  skip: (req, res) => {
    return (
      req.originalUrl === "/api/users/login" ||
      req.originalUrl === "/api/users/register"
    );
  },
});

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    if (req.originalUrl === "/api/users/login") {
      return oldJson.call(this, data);
    }
    console.log(`[${req.method}] ${req.originalUrl} -> Response:`, data);
    return oldJson.call(this, data);
  };
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ message: "Database connection successful" });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/users", userCtrl);

app.use(celebrateErrors());
export default app;
