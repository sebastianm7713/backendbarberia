import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { env } from "../../config/env";
import * as repo from "./auth.repository";
import { sendPasswordResetEmail } from "../../utils/mailer";

export const register = async (data: any) => {
  return repo.createUser(data);
};

export const login = async (email: string, password: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  let valid = false;

  if (typeof user.password === "string" && user.password.startsWith("$2")) {
    valid = await bcrypt.compare(password, user.password);
  } else {
    valid = user.password === password;
  }

  if (!valid) throw new Error("Contraseña incorrecta");

  const permisos: string[] = await repo.getPermisosByRol(user.rol_id);
  const rolName: string | null = await repo.getRolNameById(user.rol_id);
    console.log('🔵 Login para usuario:', user.email, 'rol_id:', user.rol_id);
    console.log('📋 Permisos cargados de BD:', permisos);

  const payload = {
    id: user.id_usuario,
    rol: user.rol_id,
    rol_nombre: rolName,
    nombre_rol: rolName,
    permisos,
  };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "8h" });

  return {
    token,
    user: {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      id_rol: user.rol_id,
      nombre_rol: rolName,
      permisos,
      img: user.img ?? null,
      telefono: user.telefono ?? null,
      direccion: user.direccion ?? null,
      estado: user.estado ?? null,
    },
  };
};

export const forgotPassword = async (email: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

  await repo.createPasswordResetToken(user.id_usuario, token, expiresAt);
  const emailResult = await sendPasswordResetEmail(user.email, token);

  return {
    message: 'Token de recuperación generado',
    emailSent: emailResult.smtpConfigured,
    resetUrl: emailResult.smtpConfigured ? undefined : emailResult.resetUrl,
  };
};

export const validateResetToken = async (token: string) => {
  const resetToken = await repo.findResetToken(token);
  if (!resetToken) {
    throw new Error('Token inválido');
  }

  if (resetToken.used) {
    throw new Error('Token ya fue usado');
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    throw new Error('Token expirado');
  }

  return {
    valid: true,
    expiresAt: resetToken.expires_at,
  };
};

export const resetPassword = async (token: string, password: string) => {
  const resetToken = await repo.findResetToken(token);
  if (!resetToken || resetToken.used) {
    throw new Error('Token inválido o ya usado');
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    throw new Error('Token expirado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await repo.updatePassword(resetToken.id_usuario, hashedPassword);
  await repo.markResetTokenUsed(token);

  return { message: 'Contraseña restablecida correctamente' };
};