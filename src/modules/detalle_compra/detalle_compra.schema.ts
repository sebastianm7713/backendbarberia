import { z } from "zod";

export interface DetalleCompra {
  id_detalle_compra: number;
  id_compra: number;
  id_producto: number;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

export const createDetalleCompraSchema = z.object({
  id_compra: z.number().int().positive(),
  id_producto: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  costo_unitario: z.number().positive(),
});

export const updateDetalleCompraSchema = z.object({
  id_producto: z.number().int().positive().optional(),
  cantidad: z.number().int().positive().optional(),
  costo_unitario: z.number().positive().optional(),
});

export const detalleIdSchema = z.object({
  id: z.number().int().positive(),
});