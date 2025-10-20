import { Router } from "express";
import * as ctrl from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/user.middleware";

const router = Router();

// públicas
router.post("/auth/register", ctrl.register);
router.post("/auth/login", ctrl.login);
router.get("/auth/check-email", ctrl.checkEmail);

router.get("/auth/protected", authMiddleware, (_req, res) => {
  res.json({ message: "Acesso autorizado" });
});

export default router;
