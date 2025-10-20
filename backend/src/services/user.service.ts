import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("JWT_SECRET missing");

const EXPIRES = process.env.JWT_EXPIRES as unknown as number;
if (!EXPIRES) throw new Error("JWT_EXPIRES missing");

export async function isEmailAvailable(email: string) {
  const exists = await User.exists({ email });
  return !exists;
}

export async function registerUser(email: string, plainPassword: string) {
  const exists = await User.findOne({ email }).lean();
  if (exists) throw new Error("email_exists");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  try {
    const savedUser = await User.create({
      email,
      password: passwordHash,
    });
    return { id: savedUser._id, email: savedUser.email };

  } catch (error) {
    throw new Error("registration_failed");
  }
}

export async function loginUser(email: string, plainPassword: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid_credentials");

  const ok = await bcrypt.compare(plainPassword, user.password); // senha hasheada
  if (!ok) throw new Error("invalid_credentials");

  const token = jwt.sign(
    { sub: user.id.toString(), email: user.email },
    SECRET,
    { expiresIn: EXPIRES }
  );
  return { token };
}
