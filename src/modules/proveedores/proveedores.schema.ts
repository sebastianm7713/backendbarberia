import { z } from "zod";

export const createProveedorSchema = z.object({
  id_marca: z.number().int().positive().optional().nullable(),
  id_tipo_documento: z.number().int().positive(),
  numero_documento: z.string().min(1).max(50),
  nombre: z.string().min(1).max(200),
  representante: z.string().max(150).optional().nullable(),
  telefono: z.string().max(30).optional().nullable(),
  correo: z.string().email().max(150).optional().nullable(),
  nit: z.string().max(50).optional().nullable(),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateProveedorSchema = z.object({
  id_marca: z.number().int().positive().optional().nullable(),
  id_tipo_documento: z.number().int().positive().optional(),
  numero_documento: z.string().min(1).max(50).optional(),
  nombre: z.string().min(1).max(200).optional(),
  representante: z.string().max(150).optional().nullable(),
  telefono: z.string().max(30).optional().nullable(),
  correo: z.string().email().max(150).optional().nullable(),
  nit: z.string().max(50).optional().nullable(),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
});

export const proveedorIdSchema = z.object({
  id: z.number().int().positive(),
});