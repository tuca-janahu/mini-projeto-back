import express from "express"
import cors from "cors";
import userRoutes from "./routes/user.routes";
import healthRoutes from "./routes/health.routes";

const app = express();
app.use(cors());
app.use(express.json());

// suas rotas:

app.use("/auth", userRoutes);
app.use("/health", healthRoutes);

export default app;
