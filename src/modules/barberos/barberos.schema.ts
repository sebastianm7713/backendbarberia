import { z } from 'zod';

export const barberoIdSchema = z.object({
  id: z.number().int().positive('ID debe ser un número positivo'),
});

export const createBarberoSchema = z.object({
  id_usuario: z.number().int().positive('id_usuario es requerido'),
  tipo_contrato: z.enum(['porcentaje', 'alquiler']),
  porcentaje_ganancia: z
    .number()
    .min(1, 'Porcentaje mínimo es 1')
    .max(100, 'Porcentaje máximo es 100')
    .nullable()
    .optional(),
  hora_inicio: z.string().regex(/^\d{2}:\d{2}$/, 'hora_inicio debe tener formato HH:MM'),
  hora_fin: z.string().regex(/^\d{2}:\d{2}$/, 'hora_fin debe tener formato HH:MM'),
  estado: z
    .enum(['Activo', 'Inactivo'])
    .optional()
    .default('Activo'),
});

export const updateBarberoSchema = createBarberoSchema.partial();

export type Barbero = z.infer<typeof createBarberoSchema>;
export type UpdateBarberoRequest = z.infer<typeof updateBarberoSchema>;