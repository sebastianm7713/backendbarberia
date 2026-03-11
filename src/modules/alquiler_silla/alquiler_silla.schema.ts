import { z } from "zod";

export const createAlquilerSchema = z.object({
  id_barbero: z.number().int().positive(),
  monto: z.number().positive(),
  periodo: z.enum(["diario", "semanal", "mensual"]),
});

export const updateAlquilerSchema = z.object({
  monto: z.number().positive().optional(),
  periodo: z.enum(["diario", "semanal", "mensual"]).optional(),
  estado: z.string().optional(),
});

export const alquilerIdSchema = z.object({
  id: z.number().int().positive(),
});