import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import exerciseRoutes from "./routes/exercise.routes";
import trainingDayRoutes from "./routes/trainingDay.routes";
import trainingSessionRoutes from "./routes/trainingSession.routes";
import healthRoutes from "./routes/health.routes";
import { connection } from "mongoose";
import db from "./database/configdb"; // ajuste o caminho se preciso

const app = express();

const ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // permite chamadas de ferramentas sem Origin (ex.: curl, Postman) e de origens listadas
    if (!origin || ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true, // necessário para cookies e fetch com credentials: 'include'
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());

// app.ts, ANTES das rotas (temporário pra debug)
app.use(async (req, res, next) => {
  // if (req.method === "OPTIONS") return res.sendStatus(204); // CORS preflight: não abrir conexão
  if (connection.readyState !== 1) {
    try {
      console.log("[DB-GUARD] connecting on-demand for", req.method, req.path);
      await db.connect(); // idempotente (usa cache)
      console.log("[DB-GUARD] connected. state =", connection.readyState);
    } catch (err) {
      console.error("[DB-GUARD] connect failed:", err);
      return res.status(503).json({ error: "DB unavailable" });
    }
  }
  next();
});

app.use((req, _res, next) => {
  if (req.path === "/auth/register" && req.method === "POST") {
    console.log(
      "[MIDDLEWARE] register content-type:",
      req.headers["content-type"]
    );
  }
  next();
});

app.get("/", (_req, res) => {
  res.send("✅ API online");
});

app.use("/auth", userRoutes);
app.use("/health", healthRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/training-days", trainingDayRoutes);
app.use("/training-sessions", trainingSessionRoutes);

export default app;
