import { z } from "zod";

export const createPagoSchema = z.object({
  id_compra: z.preprocess((value) => Number(value), z.number().int().positive()),
  monto_pagado: z.preprocess((value) => Number(value), z.number().positive()),
  fecha_pago: z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), z.string().datetime().optional()),
  metodo_pago: z.string().min(1).max(50),
  referencia: z.string().min(1).max(100),
});

export const updatePagoSchema = z.object({
  monto_pagado: z.preprocess((value) => Number(value), z.number().positive().optional()),
  fecha_pago: z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), z.string().datetime().optional()),
  metodo_pago: z.string().min(1).max(50).optional(),
  referencia: z.string().min(1).max(100).optional(),
});

export const pagoIdSchema = z.object({
  id: z.number().int().positive(),
});

// Validación especial para pagos de consignación
export const createPagoConsignacionSchema = z.object({
  id_compra: z.preprocess((value) => Number(value), z.number().int().positive()),
  monto_pagado: z.preprocess((value) => Number(value), z.number().positive()),
  fecha_pago: z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), z.string().datetime()), // OBLIGATORIO para consignación
  metodo_pago: z.string().min(1).max(50),
  referencia: z.string().min(1).max(100),
});
