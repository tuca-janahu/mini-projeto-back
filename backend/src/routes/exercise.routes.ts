import { Router } from "express";
import * as ctrl from "../controllers/exercise.controller";

const router = Router();

router.get("/availability", ctrl.checkExercise);
router.post("/", ctrl.addExercise);
router.get("/", ctrl.exerciseList);

export default router;