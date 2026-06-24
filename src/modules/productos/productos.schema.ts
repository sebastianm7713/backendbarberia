import { z } from "zod";

export const createProductoSchema = z.object({
  id_categoria: z.coerce.number().int().positive().optional().nullable(),
  id_marca: z.coerce.number().int().positive().optional().nullable(),
  nombre: z.string().min(1).max(200),
  precio: z.coerce.number().positive(),
  descripcion: z.string().max(400).optional().nullable(),
  stock: z.coerce.number().int().nonnegative().optional().default(0),
  fecha_vencimiento: z.string().optional().nullable(),
  img: z.string().max(10000000).optional().nullable(),
  estado: z.enum(['activo', 'inactivo']).optional().default('activo'),
  tipo_adquisicion: z.enum(['compra_directa', 'consignacion']).optional().default('compra_directa'),
  id_proveedor: z.coerce.number().int().positive().optional().nullable(),
  // Campos adicionales para consignación
  consignacion_data: z.object({
    cantidad_recibida: z.number().int().positive(),
    precio_proveedor: z.number().positive(),
    precio_venta: z.number().positive(),
    fecha_entrega: z.string(),
    observaciones: z.string().optional(),
  }).optional(),
}).refine((data) => {
  // Si es consignación, debe tener id_proveedor y consignacion_data
  if (data.tipo_adquisicion === 'consignacion') {
    return data.id_proveedor && data.consignacion_data;
  }
  return true;
}, {
  message: "Para productos por consignación se requiere id_proveedor y consignacion_data",
  path: ["tipo_adquisicion"],
});

export const updateProductoSchema = z.object({
  id_categoria: z.coerce.number().int().positive().optional().nullable(),
  id_marca: z.coerce.number().int().positive().optional().nullable(),
  nombre: z.string().min(1).max(200).optional(),
  precio: z.coerce.number().positive().optional(),
  descripcion: z.string().max(400).optional().nullable(),
  stock: z.coerce.number().int().nonnegative().optional(),
  fecha_vencimiento: z.string().optional().nullable(),
  img: z.string().max(10000000).optional().nullable(),
  estado: z.enum(['activo', 'inactivo']).optional(),
  tipo_adquisicion: z.enum(['compra_directa', 'consignacion']).optional(),
  id_proveedor: z.coerce.number().int().positive().optional().nullable(),
});

export const productoIdSchema = z.object({
  id: z.number().int().positive(),
});