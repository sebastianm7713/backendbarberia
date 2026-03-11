import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { env } from "../../config/env";
import * as repo from "./auth.repository";

export const register = async (data: any) => {
  return repo.createUser(data);
};

export const login = async (email: string, password: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Contraseña incorrecta");

  // traer permisos del rol
  const permisos: string[] = await repo.getPermisosByRol(user.rol_id);

  const payload = { id: user.id_usuario, rol: user.rol_id, permisos };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });

  return {
    token,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      id_rol: user.rol_id,
      permisos,
    },
  };
};