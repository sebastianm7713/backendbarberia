import { Request, Response } from "express";
import * as service from "./auth.service";

export const register = async (req: Request, res: Response) => {
  await service.register(req.body);
  res.json({ message: "Usuario creado" });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      });
    }

    const result = await service.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// devuelve los permisos decodificados del token
export const getPermisos = (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ permisos: user?.permisos || [] });
};