import { z } from "zod";

export const createDisponibilidadSchema = z.object({
  id_barbero: z.number().int().positive(),
  fecha: z.string(),
  estado: z.enum(["ausente", "cambio_horario", "descanso", "normal"]),
  motivo: z.string().min(1),
  hora_inicio: z.string(),
  hora_fin: z.string(),
});

export const updateDisponibilidadSchema = z.object({
  estado: z.enum(["ausente", "cambio_horario", "descanso", "normal"]).optional(),
  motivo: z.string().optional(),
  hora_inicio: z.string().optional(),
  hora_fin: z.string().optional(),
});

export const disponibilidadIdSchema = z.object({
  id: z.number().int().positive(),
});