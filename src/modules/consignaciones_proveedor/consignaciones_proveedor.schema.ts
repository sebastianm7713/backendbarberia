import { z } from "zod";

export const createConsignacionSchema = z.object({
  id_proveedor: z.number().int().positive(),
  id_producto: z.number().int().positive(),
  cantidad_recibida: z.number().int().positive(),
  precio_proveedor: z.number().positive(),
  precio_venta: z.number().positive(),
  fecha_entrega: z.string(),
  observaciones: z.string().optional(),
});

export const updateConsignacionSchema = z.object({
  cantidad_vendida: z.number().int().optional(),
  fecha_pago: z.string().optional(),
  estado: z.enum(["pendiente", "pagado", "devuelto"]).optional(),
  observaciones: z.string().optional(),
});

export const consignacionIdSchema = z.object({
  id: z.number().int().positive(),
});