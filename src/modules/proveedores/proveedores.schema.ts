import { z } from "zod";

export const createProveedorSchema = z.object({
  nombre: z.string().min(1),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  direccion: z.string().optional(),
});

export const updateProveedorSchema = z.object({
  nombre: z.string().min(1).optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  direccion: z.string().optional(),
});

export const proveedorIdSchema = z.object({
  id: z.number().int().positive(),
});