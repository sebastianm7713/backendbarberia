import { z } from "zod";

export const createCompraSchema = z.object({
  id_proveedor: z.number().int().positive(),
  detalles: z.array(
    z.object({
      id_producto: z.number().int().positive(),
      cantidad: z.number().int().positive(),
      costo_unitario: z.number().positive(),
    })
  ),
});

export const updateCompraSchema = z.object({
  id_proveedor: z.number().int().positive().optional(),
  total: z.number().positive().optional(),
});

export const compraIdSchema = z.object({
  id: z.number().int().positive(),
});