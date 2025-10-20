import { Router } from "express";
import * as ctrl from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/user.middleware";

const router = Router();

// públicas
router.post("/auth/register", ctrl.register);
router.post("/auth/login", ctrl.login);
router.get("/auth/check-email", ctrl.checkEmail);

router.get("/auth/protected", authMiddleware, (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Acesso autorizado", user });
});

export default router;
