import { Request, Response } from "express";
import { isExerciseNameAvailable, createExercise } from "../services/exercise.service";

export async function checkExercise(req: Request, res: Response){
    const userId = (req as any).user.sub;
    const name = req.params.name;

    const isAvailable = await isExerciseNameAvailable(userId, name);
    if (!isAvailable) {
        return res.status(409).json({ message: "Exercise name already exists" });
    }

    return res.status(200).json({ message: "Exercise name is available" });
}

export async function addExercise(req: Request, res: Response) {
    const userId = (req as any).user.sub;
    const { name, muscleGroup, weightUnit } = req.body;

    try {
        const exercise = await createExercise(userId, name, muscleGroup, weightUnit);
        return res.status(201).json(exercise);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return res.status(409).json({ Error: message });
    }
}

