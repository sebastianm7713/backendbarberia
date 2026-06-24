"use strict";
// ARCHIVO PARA COPIAR AL BACKEND: modules/clientes/clientes.schema.ts
// Schema actualizado con los campos que devuelve el JOIN con Usuarios
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteIdSchema = exports.updateClienteSchema = exports.createClienteSchema = void 0;
const zod_1 = require("zod");
exports.createClienteSchema = zod_1.z.object({
    id_usuario: zod_1.z.number().int().positive("id_usuario debe ser un número positivo"),
    estado: zod_1.z.string().optional().default("Activo"),
});
exports.updateClienteSchema = zod_1.z.object({
    estado: zod_1.z.string().optional(),
});
exports.clienteIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
