import {Exercise, WeightUnit, MuscleGroup} from "../models/exercise.model";

export async function isExerciseNameAvailable(
  userId: string,
  name: string
) {
  const nameLower = name.trim().toLowerCase();
  const exists = await Exercise.exists({ userId, nameLower });
  return !exists;
}

export async function createExercise(
  userId: string,
  name: string,
  muscleGroup: MuscleGroup,
  weightUnit: WeightUnit
) {
  const isAvailable = await isExerciseNameAvailable(userId, name);
  if (!isAvailable) {
    throw new Error("Exercise name already exists");
  }

  const exercise = new Exercise({
    userId,
    name: name.trim(),
    muscleGroup,
    weightUnit,
  });

  try {
    await exercise.save();
    return exercise;
  } catch (err: any) {
    if (err?.code === 11000) {
      throw new Error("E_DUPLICATE_NAME");
    }
    throw err;
  }
}

export async function listExercises(
  userId: string,
  filters?: { muscleGroup?: MuscleGroup; weightUnit?: WeightUnit; name?: string },
  page = 1,
  limit = 20
) {
  const q: any = { userId };
  if (filters?.muscleGroup) q.muscleGroup = filters.muscleGroup;
  if (filters?.weightUnit) q.weightUnit = filters.weightUnit;
  if (filters?.name) q.name = { $regex: filters.name, $options: "i" };

  const [items, total] = await Promise.all([
    Exercise.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Exercise.countDocuments(q),
  ]);
  return { items, total, page, limit };
}