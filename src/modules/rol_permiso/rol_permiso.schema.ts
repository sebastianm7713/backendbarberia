import { z } from 'zod';

export const rolPermisoSchema = z.object({
  id_rol: z.number().int().positive('ID rol requerido'),
  id_permiso: z.number().int().positive('ID permiso requerido'),
});

export const createRolPermisoSchema = rolPermisoSchema;

export type RolPermiso = z.infer<typeof rolPermisoSchema>;
export type CreateRolPermiso = z.infer<typeof createRolPermisoSchema>;
