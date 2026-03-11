import { z } from "zod";

export const createProductoSchema = z.object({
  id_categoria: z.number().int().positive().optional(),
  id_marca: z.number().int().positive().optional(),
  nombre: z.string().min(1).max(200),
  precio: z.number().positive(),
  descripcion: z.string().max(400).optional(),
  stock: z.number().int().nonnegative().optional(),
  fecha_vencimiento: z.string().datetime().optional(),
  img: z.string().max(250).optional(),
});

export const updateProductoSchema = z.object({
  id_categoria: z.number().int().positive().optional(),
  id_marca: z.number().int().positive().optional(),
  nombre: z.string().min(1).max(200).optional(),
  precio: z.number().positive().optional(),
  descripcion: z.string().max(400).optional(),
  stock: z.number().int().nonnegative().optional(),
  fecha_vencimiento: z.string().datetime().optional(),
  img: z.string().max(250).optional(),
});

export const productoIdSchema = z.object({
  id: z.number().int().positive(),
});
