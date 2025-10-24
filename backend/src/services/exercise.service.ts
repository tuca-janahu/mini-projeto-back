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
    name,
    muscleGroup,
    weightUnit,
  });

  await exercise.save();
  return exercise;
}
