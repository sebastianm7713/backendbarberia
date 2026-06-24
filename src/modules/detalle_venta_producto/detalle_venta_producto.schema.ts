import { z } from 'zod';

export const detalleVentaProductoSchema = z.object({
  id_venta: z.coerce.number().int().positive('id_venta debe ser un número entero positivo'),
  id_producto: z.coerce.number().int().positive('id_producto debe ser un número entero positivo'),
  cantidad: z.coerce.number().int().positive('cantidad debe ser un número entero positivo'),
  precio_unitario: z.coerce.number().positive('precio_unitario debe ser un número positivo'),
  subtotal: z.coerce.number().positive('subtotal debe ser un número positivo'),
});

export const createDetalleVentaProductoSchema = detalleVentaProductoSchema.omit({ subtotal: true });

export type DetalleVentaProducto = z.infer<typeof detalleVentaProductoSchema>;
export type CreateDetalleVentaProducto = z.infer<typeof createDetalleVentaProductoSchema>;
