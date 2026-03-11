import { z } from "zod";

export const createTipoDocumentoSchema = z.object({
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(150).optional(),
  estado: z.string().max(20).optional(),
});

export const updateTipoDocumentoSchema = z.object({
  nombre: z.string().min(1).max(50).optional(),
  descripcion: z.string().max(150).optional(),
  estado: z.string().max(20).optional(),
});

export const tipoDocumentoIdSchema = z.object({
  id: z.number().int().positive(),
});