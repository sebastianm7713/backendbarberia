import { z } from "zod";

export const createCitaSchema = z.object({
  id_cliente: z.number().int().positive(),
  id_barbero: z.number().int().positive(),
  id_servicio: z.number().int().positive().optional(),
  fecha: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  hora: z.string().regex(/\d{2}:\d{2}/),
  productos: z.array(
    z.object({
      id_producto: z.number().int().positive(),
      cantidad: z.number().int().positive(),
      precio_unitario: z.number().positive(),
    })
  ).optional(),
});

export const createCitaLandingSchema = z.object({
  id_barbero: z.number().int().positive(),
  id_servicio: z.number().int().positive().optional(),
  fecha: z.string().regex(/\d{4}-\d{2}-\d{2}/),
  hora: z.string().regex(/\d{2}:\d{2}/),
  guest_nombre: z.string().min(2).max(200),
  guest_email: z.string().email(),
  guest_telefono: z.string().min(7).max(20),
  productos: z.array(
    z.object({
      id_producto: z.number().int().positive(),
      cantidad: z.number().int().positive(),
      precio_unitario: z.number().positive(),
    })
  ).optional(),
});

export const updateCitaEstadoSchema = z.object({
  estado: z.enum(["pendiente", "confirmada", "completado", "cancelado", "en_ejecucion"]),
}).strip();

export const updateCitaSchema = z.object({
  id_cliente: z.number().int().positive().optional(),
  id_barbero: z.number().int().positive().optional(),
  id_servicio: z.number().int().positive().optional(),
  fecha: z.string().regex(/\d{4}-\d{2}-\d{2}/).optional(),
  hora: z.string().regex(/\d{2}:\d{2}/).optional(),
  estado: z.enum(["pendiente", "confirmada", "completado", "cancelado", "en_ejecucion"]).optional(),
  productos: z.array(z.object({
    id_producto: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    precio_unitario: z.number().positive(),
  })).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Se requiere al menos un campo para actualizar",
});

export const citaIdSchema = z.object({
  id: z.number().int().positive(),
});
