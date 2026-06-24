import { z } from 'zod';

export interface Marca {
  id_marca: number;
  nombre: string;
}

export const createMarcaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
});

export const updateMarcaSchema = createMarcaSchema.partial();

export const marcaIdSchema = z.object({
  id: z.number().int().positive(),
});