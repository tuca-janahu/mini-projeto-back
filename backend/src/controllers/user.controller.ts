import { Request, Response } from "express";
import { isEmailAvailable, registerUser, loginUser } from "../services/user.service";

export async function checkEmail(req: Request, res: Response) {
  const email = String(req.query.email || "").trim();
  if (!email) return res.status(400).json({ error: "Email obrigatório" });
  const available = await isEmailAvailable(email);
  return res.json({ available });
}

export async function register(req: Request, res: Response) {
  if(!req.body || !!req.body.email === false || !!req.body.password === false) {
    return  res.status(400).json({ error: "Dados obrigatórios" });
  }
  
  const { email, password } = req.body ?? {};
  
  if (password.length < 6) {
    console.warn("⚠️ Senha muito fraca para o email:");
    return res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres" });
  }
  
 try {
    const out = await registerUser(email, password);
    console.log("✅ Usuário registrado:", out.email);      // <-- só loga no sucesso
    return res.status(201).json(out);
  } catch (e: any) {
    if (e.message === "email_exists") {
      console.warn("⚠️ Tentativa de registrar email já existente:", email);
      return res.status(409).json({ error: "Email já cadastrado" });
    }
    console.error("❌ Erro ao registrar:", e?.message || e);
    return res.status(500).json({ error: "Erro ao registrar" });
  }
}

export async function login(req: Request, res: Response) {
  console.log("Login do usuário:" , req.body.email);

  if(!req.body || !!req.body.email === false || !!req.body.password === false) {
    return  res.status(400).json({ error: "Dados obrigatórios" });
  }
  
  const { email, password } = req.body ?? {};
  
  try {
    const out = await loginUser(email, password);
    return res.json(out); 
  } catch (e: any) {
    if (e.message === "invalid_credentials") return res.status(401).json({ error: "Credenciais inválidas" });
    return res.status(500).json({ error: "Erro ao autenticar" });
  }
}
