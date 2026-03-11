import { z } from "zod";

export const createCitaSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_barbero: z.number().int().positive(),
  id_servicio: z.number().int().positive().optional(),
  fecha: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  hora: z.string().regex(/\d{2}:\d{2}/),
});

export const updateCitaEstadoSchema = z.object({
  estado: z.enum(["pendiente", "confirmada", "completado", "cancelado"]),
});

export const citaIdSchema = z.object({
  id: z.number().int().positive(),
});
