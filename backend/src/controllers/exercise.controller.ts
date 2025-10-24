import { Request, Response } from "express";
import { isExerciseNameAvailable, createExercise, listExercises } from "../services/exercise.service";

export async function checkExercise(req: Request, res: Response){
    const userId = (req as any).user.sub;
    const name = String(req.query.name || "").trim();
    
    if (!name) return res.status(400).json({ error: "Missing 'name' query param" });

    const available = await isExerciseNameAvailable(userId, name);
    return res.status(200).json({ available });
}

export async function addExercise(req: Request, res: Response) {
    const userId = (req as any).user.sub;
    const { name, muscleGroup, weightUnit } = req.body;

    if (!name || !muscleGroup || !weightUnit) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const exercise = await createExercise(userId, name, muscleGroup, weightUnit);
        return res.status(201).json(exercise);
    } catch (error: any) {
    if (error?.message === "E_DUPLICATE_NAME") {
      return res.status(409).json({ error: "Exercise name already exists" });
    }
    return res.status(500).json({ error: "Internal error" });
  }
}

export async function exerciseList(req: Request, res: Response) {
    const userId = (req as any).user.sub;
    const { muscleGroup, weightUnit, name, page = "1", limit = "20" } = req.query;

    try {
    const data = await listExercises(
      userId,
      { muscleGroup: muscleGroup as any, weightUnit: weightUnit as any, name: name as any },
      Number(page),
      Number(limit)
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal error" });
  }
}
