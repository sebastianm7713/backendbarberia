import { z } from "zod";

export const createDevolucionProveedorSchema = z.object({
  id_detalle_compra: z.number().int().positive(),
  id_proveedor: z.number().int().positive(),
  motivo: z.string().optional(),
  cantidad_devuelta: z.number().int().positive(),
});

export const updateDevolucionProveedorSchema = z.object({
  motivo: z.string().optional(),
  cantidad_devuelta: z.number().int().positive().optional(),
  estado: z.enum(["pendiente", "aceptada", "rechazada"]).optional(),
});

export const devolucionProveedorIdSchema = z.object({
  id: z.number().int().positive(),
});