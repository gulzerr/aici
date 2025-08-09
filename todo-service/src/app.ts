import express from "ultimate-express";
import bodyParser from "body-parser";
import cors from "cors";
import prisma from "./utils/db";
import morganBody from "morgan-body";
import todoCtrl from "./controllers/todo";
import completeCtrl from "./controllers/complete";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();

app.use(bodyParser.json());
morganBody(app);

app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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

app.use("/api/todos", todoCtrl);
app.use("/api", completeCtrl);

export default app;
