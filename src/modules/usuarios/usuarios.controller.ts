import { Request, Response } from "express";
import * as service from "./usuarios.service";

export const getUsuarios = async (req: Request, res: Response) => {
  const data = await service.getUsuarios();
  res.json(data);
};

export const crearUsuario = async (req: Request, res: Response) => {
  await service.crearUsuario(req.body);
  res.json({ message: "Usuario creado" });
};