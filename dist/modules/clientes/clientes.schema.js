"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteIdSchema = exports.updateClienteSchema = exports.createClienteSchema = void 0;
const zod_1 = require("zod");
exports.createClienteSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1),
    apellido: zod_1.z.string().min(1),
    telefono: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    fecha_nacimiento: zod_1.z.string().optional(), // Assuming date as string
});
exports.updateClienteSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).optional(),
    apellido: zod_1.z.string().min(1).optional(),
    telefono: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    fecha_nacimiento: zod_1.z.string().optional(),
});
exports.clienteIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
