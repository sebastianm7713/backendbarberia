import { z } from "zod";

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1).max(150),
  descripcion: z.string().max(255).optional(),
});

export const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).max(150).optional(),
  descripcion: z.string().max(255).optional(),
});

export const categoriaIdSchema = z.object({
  id: z.number().int().positive(),
});