import { z } from "zod";

export const createDevolucionSchema = z.object({
  id_detalle_producto: z.number().int().positive(),
  motivo: z.string().optional(),
  remitido: z.enum(["stock", "proveedor"]),
});

export const updateDevolucionSchema = z.object({
  motivo: z.string().optional(),
  remitido: z.enum(["stock", "proveedor"]).optional(),
});

export const devolucionIdSchema = z.object({
  id: z.number().int().positive(),
});
