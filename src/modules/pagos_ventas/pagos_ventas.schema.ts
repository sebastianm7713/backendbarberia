import { z } from "zod";

export const createPagoVentaSchema = z.object({
  id_venta: z.preprocess((value) => Number(value), z.number().int().positive()),
  monto_pagado: z.preprocess((value) => Number(value), z.number().positive()),
  fecha_pago: z.preprocess(
    (value) => (value ? new Date(String(value)).toISOString() : undefined),
    z.string().datetime().optional()
  ),
  metodo_pago: z.string().min(1).max(50),
  referencia: z.string().min(1).max(100),
});

export const updatePagoVentaSchema = z.object({
  monto_pagado: z.preprocess((value) => (value !== undefined ? Number(value) : undefined), z.number().positive().optional()),
  fecha_pago: z.preprocess(
    (value) => (value ? new Date(String(value)).toISOString() : undefined),
    z.string().datetime().optional()
  ),
  metodo_pago: z.string().min(1).max(50).optional(),
  referencia: z.string().min(1).max(100).optional(),
});

export const pagoVentaIdSchema = z.object({
  id: z.number().int().positive(),
});