// ARCHIVO PARA COPIAR AL BACKEND: modules/clientes/clientes.schema.ts
// Schema actualizado con los campos que devuelve el JOIN con Usuarios

import { z } from "zod";

export const createClienteSchema = z.object({
  id_usuario: z.number().int().positive("id_usuario debe ser un número positivo"),
  estado: z.string().optional().default("Activo"),
});

export const updateClienteSchema = z.object({
  estado: z.string().optional(),
});

export const clienteIdSchema = z.object({
  id: z.number().int().positive(),
});

// Interfaz Cliente - Con los campos del JOIN
export interface Cliente {
  id_cliente: number;
  id_usuario: number;
  estado: string;
  nombre: string;           // Del JOIN con Usuarios
  numero_documento: string; // Del JOIN con Usuarios
  email?: string;           // Del JOIN con Usuarios
  telefono?: string;        // Del JOIN con Usuarios
  img?: string;             // Del JOIN con Usuarios - para mostrar en UI
}

// Interfaz para crear cliente
export interface CreateClienteDTO {
  id_usuario: number;
  estado?: string;
}

// Interfaz para actualizar cliente
export interface UpdateClienteDTO {
  estado?: string;
}
