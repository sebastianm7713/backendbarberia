import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  rol_id: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});