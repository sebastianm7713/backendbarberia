import { z } from "zod";

export const createMarcaSchema = z.object({
  nombre: z.string().min(1).max(150),
});

export const updateMarcaSchema = z.object({
  nombre: z.string().min(1).max(150).optional(),
});

export const marcaIdSchema = z.object({
  id: z.number().int().positive(),
});