import { z } from "zod";

export const createServicioSchema = z.object({
  nombre: z.string().min(1).max(200),
  descripcion: z.string().max(400).optional(),
  precio: z.number().positive(),
  duracion: z.number().int().positive(),
  porcentaje_barbero: z.number().min(0).max(100),
  imagen: z.string().optional(),
  img: z.string().optional(),
});

export const updateServicioSchema = createServicioSchema.partial();

export const servicioIdSchema = z.object({
  id: z.number().int().positive(),
});