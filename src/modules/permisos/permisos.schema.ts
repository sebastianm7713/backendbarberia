import { z } from "zod";

export const createPermisoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().min(1).max(255),
});

export const updatePermisoSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(255).optional(),
});

export const permisoIdSchema = z.object({
  id: z.number().int().positive(),
});