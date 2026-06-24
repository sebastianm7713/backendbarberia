import { z } from 'zod';

export interface CategoriaProducto {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
}

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();

export const categoriaIdSchema = z.object({
  id: z.number().int().positive(),
});