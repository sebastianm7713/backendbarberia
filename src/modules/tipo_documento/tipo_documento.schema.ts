import { z } from 'zod';

export interface TipoDocumento {
  id_tipo_documento: number;
  nombre: string;
  descripcion?: string;
  estado: string;
}

export const createTipoDocumentoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  estado: z.string().default('Activo'),
});

export const updateTipoDocumentoSchema = createTipoDocumentoSchema.partial();

export const tipoDocumentoIdSchema = z.object({
  id: z.number().int().positive(),
});