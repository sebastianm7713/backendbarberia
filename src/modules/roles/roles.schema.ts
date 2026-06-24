import { z } from 'zod';

export const createRolSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(50),
  descripcion: z.string().optional().nullable(),
  permisos: z.array(z.number().int().positive()).optional(),
  estado: z.enum(['activo', 'inactivo']).optional().default('activo')
});

export const updateRolSchema = z.object({
  nombre: z.string().min(1).max(50).optional(),
  descripcion: z.string().max(255).optional().nullable(),
  estado: z.enum(['activo', 'inactivo']).optional(),
  permisos: z.array(z.number().int().positive()).optional(),
});

export const rolIdSchema = z.object({
  id: z.number().int().positive()
});

export type CreateRol = z.infer<typeof createRolSchema>;
export type UpdateRol = z.infer<typeof updateRolSchema>;