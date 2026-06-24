import { z } from "zod";

export const createDevolucionSchema = z.object({
  id_detalle_producto: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  motivo: z.string().optional(),
  remitido: z.enum(["stock", "proveedor"]),
  id_proveedor: z.number().int().positive().optional(),
}).refine((data) => {
  // Si remitido es 'proveedor', debe tener id_proveedor
  if (data.remitido === 'proveedor') {
    return data.id_proveedor !== undefined;
  }
  return true;
}, {
  message: "Para devoluciones a proveedor se requiere id_proveedor",
  path: ["id_proveedor"],
});

export const updateDevolucionSchema = z.object({
  cantidad: z.number().int().positive().optional(),
  motivo: z.string().optional(),
  remitido: z.enum(["stock", "proveedor"]).optional(),
  id_proveedor: z.number().int().positive().optional(),
});

export const devolucionIdSchema = z.object({
  id: z.number().int().positive(),
});

export const productosPorProveedorSchema = z.object({
  id_proveedor: z.number().int().positive(),
});
