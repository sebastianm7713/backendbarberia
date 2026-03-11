import { z } from "zod";

export const createRolSchema = z.object({
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(255).optional(),
});

export const updateRolSchema = z.object({
  nombre: z.string().min(1).max(50).optional(),
  descripcion: z.string().max(255).optional(),
});

export const rolIdSchema = z.object({
  id: z.number().int().positive(),
});