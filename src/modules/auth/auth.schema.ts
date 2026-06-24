// ===== AUTH.SCHEMA.TS (CORREGIDO) =====
// Reemplaza el archivo auth.schema.ts en tu backend con esto

import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  id_tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  img: z.string().optional(),  // ✅ NUEVO: validación para img (base64)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});
