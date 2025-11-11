import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import exerciseRoutes from "./routes/exercise.routes";
import trainingDayRoutes from "./routes/trainingDay.routes";
import trainingSessionRoutes from "./routes/trainingSession.routes";
import healthRoutes from "./routes/health.routes";
import { swaggerUi, swaggerSpec } from "./swagger";
import { connection } from "mongoose";
import db from "./database/configdb"; // ajuste o caminho se preciso

const app = express();

const ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, cb) {
    // permite curl/Postman (sem Origin) e libera as origens declaradas
    if (!origin) return cb(null, true);
    if (ORIGINS.includes(origin)) return cb(null, true);

    // LOG útil em prod pra diagnosticar
    console.warn("[CORS] Origin não permitida:", origin, "Permitidas:", ORIGINS);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  optionsSuccessStatus: 204,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Dica: garanta o Vary pra caches/reverse proxies
app.use((_, res, next) => { res.setHeader("Vary", "Origin"); next(); });

// **MANTENHA** isto ANTES de tudo que pode lançar erro
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


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

// Spec crua (CI/SDK)
app.get("/openapi.json", (_req, res) => {
  res.type("application/json").send(swaggerSpec);
});

// UI
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    swaggerOptions: { persistAuthorization: true }
  })
);

app.get("/", (_req, res) => {
  res.send("✅ API online");
});

app.use("/auth", userRoutes);
app.use("/health", healthRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/training-days", trainingDayRoutes);
app.use("/training-sessions", trainingSessionRoutes);

export default app;
