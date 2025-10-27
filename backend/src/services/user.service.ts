import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { User } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

function getJwtSecret(): Secret {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET missing");
  return s; // TS sabe que aqui é string
}
const SECRET: Secret = getJwtSecret();

const EXPIRES: string = (process.env.JWT_EXPIRES || "3600").trim();

if (!EXPIRES) throw new Error("JWT_EXPIRES missing");

const DUMMY_HASH =
  "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36T1Zq9VHtVui1eS8aJf.eW"; // "senha" bcrypt

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
      email: email.trim().toLowerCase(),
      password: passwordHash,
    });
    return { id: savedUser._id, email: savedUser.email };
  } catch (error: any) {
    console.error("[registerUser] create error:", { code: error?.code, keyValue: error?.keyValue, msg: error?.message });
    throw new Error("registration_failed");
  }
}

export async function loginUser(email: string, plainPassword: string) {
  const normEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normEmail }).select("+password");

  if (!user) {
    // compara com hash dummy para igualar tempo de resposta
    await bcrypt.compare(plainPassword, DUMMY_HASH);
    const err: any = new Error("user_not_found");
    err.status = 401;
    throw err;
  }

  const ok = await bcrypt.compare(plainPassword, user.password); // senha hasheada
  if (!ok) {
    const err: any = new Error("wrong_password");
    err.status = 401;
    throw err;
  }

  type Claims = { sub: string; email: string };

 function issueToken(claims: Claims) {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: Number(EXPIRES), // use configured expiration
  };
  return jwt.sign(claims, SECRET, options);
}

const token = issueToken({ sub: user._id.toString(), email: user.email });
  return { token };
}



