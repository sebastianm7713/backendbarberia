import { z } from "zod";

export const createUsuarioSchema = z.object({
  id_rol: z.number().int().positive(),
  id_tipo_documento: z.number().int().positive(),
  numero_documento: z.string().min(1).max(50),
  nombre: z.string().min(1).max(150),
  email: z.string().email().max(150).optional(),
  telefono: z.string().max(30).optional(),
  direccion: z.string().max(250).optional(),
  contrasena: z.string().min(6),
  img: z.string().max(1000000).optional(),
  estado: z.enum(['activo', 'inactivo']).optional().default('activo'),
});

export const updateUsuarioSchema = z.object({
  id_rol: z.number().int().positive().optional(),
  id_tipo_documento: z.number().int().positive().optional(),
  numero_documento: z.string().min(1).max(50).optional(),
  nombre: z.string().min(1).max(150).optional(),
  email: z.string().email().max(150).optional(),
  telefono: z.string().max(30).optional(),
  direccion: z.string().max(250).optional(),
  contrasena: z.string().min(6).optional(),
  img: z.string().max(1000000).optional(),
  estado: z.enum(['activo', 'inactivo']).optional(),
});

export const usuarioIdSchema = z.object({
  id: z.number().int().positive(),
});