import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import "./models";
import { seedDatabase } from "./config/seed";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import { errorHandler } from "./middlewares/error.middleware";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("FATAL ERROR: JWT_SECRET must be at least 32 characters long.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) =>
    origin
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/+$/, ""),
  )
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

sequelize
  .sync()
  .then(async () => {
    console.log("Database synced successfully");
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("DB Sync Error:", err));
