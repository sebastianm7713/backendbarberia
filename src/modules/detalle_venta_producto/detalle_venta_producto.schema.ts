import { z } from 'zod';

export const detalleVentaProductoSchema = z.object({
  id_venta: z.number().int().positive('ID venta requerido'),
  id_producto: z.number().int().positive('ID producto requerido'),
  cantidad: z.number().int().positive('Cantidad debe ser mayor a 0'),
  precio_unitario: z.number().positive('Precio unitario debe ser mayor a 0'),
  subtotal: z.number().positive('Subtotal debe ser mayor a 0'),
});

export const createDetalleVentaProductoSchema = detalleVentaProductoSchema.omit({ subtotal: true });

export type DetalleVentaProducto = z.infer<typeof detalleVentaProductoSchema>;
export type CreateDetalleVentaProducto = z.infer<typeof createDetalleVentaProductoSchema>;
