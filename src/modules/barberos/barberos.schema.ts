import { z } from "zod";

export const createBarberoSchema = z.object({
  id_usuario: z.number().int().positive(),
  tipo_contrato: z.enum(["porcentaje", "alquiler"]),
  porcentaje_ganancia: z.number().min(0).max(100).optional(),
  hora_inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  hora_fin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
});

export const updateBarberoSchema = z.object({
  tipo_contrato: z.enum(["porcentaje", "alquiler"]).optional(),
  porcentaje_ganancia: z.number().min(0).max(100).optional(),
  hora_inicio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  hora_fin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  estado: z.string().optional(),
});

export const barberoIdSchema = z.object({
  id: z.number().int().positive(),
});