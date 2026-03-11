import { z } from 'zod';

export const detalleVentaServicioSchema = z.object({
  id_venta: z.number().int().positive('ID venta requerido'),
  id_servicio: z.number().int().positive('ID servicio requerido'),
  id_barbero: z.number().int().positive('ID barbero requerido'),
  cantidad: z.number().int().positive('Cantidad debe ser mayor a 0'),
  precio_unitario: z.number().positive('Precio unitario debe ser mayor a 0'),
  subtotal: z.number().positive('Subtotal debe ser mayor a 0'),
});

export const createDetalleVentaServicioSchema = detalleVentaServicioSchema.omit({ subtotal: true });

export type DetalleVentaServicio = z.infer<typeof detalleVentaServicioSchema>;
export type CreateDetalleVentaServicio = z.infer<typeof createDetalleVentaServicioSchema>;
