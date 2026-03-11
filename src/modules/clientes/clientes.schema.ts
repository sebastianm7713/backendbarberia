import { z } from "zod";

export const createClienteSchema = z.object({
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  fecha_nacimiento: z.string().optional(), // Assuming date as string
});

export const updateClienteSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  fecha_nacimiento: z.string().optional(),
});

export const clienteIdSchema = z.object({
  id: z.number().int().positive(),
});