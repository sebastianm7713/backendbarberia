import { z } from 'zod';

export const detalleVentaServicioSchema = z.object({
  id_venta: z.coerce.number().int().positive('id_venta debe ser un número entero positivo'),
  id_servicio: z.coerce.number().int().positive('id_servicio debe ser un número entero positivo'),
  id_barbero: z.coerce.number().int().positive('id_barbero debe ser un número entero positivo'),
  cantidad: z.coerce.number().int().positive('cantidad debe ser un número entero positivo'),
  precio_unitario: z.coerce.number().positive('precio_unitario debe ser un número positivo'),
  subtotal: z.coerce.number().positive('subtotal debe ser un número positivo'),
});

export const createDetalleVentaServicioSchema = detalleVentaServicioSchema.omit({ subtotal: true });

export type DetalleVentaServicio = z.infer<typeof detalleVentaServicioSchema>;
export type CreateDetalleVentaServicio = z.infer<typeof createDetalleVentaServicioSchema>;
