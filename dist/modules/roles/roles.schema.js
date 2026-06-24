"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolIdSchema = exports.updateRolSchema = exports.createRolSchema = void 0;
const zod_1 = require("zod");
exports.createRolSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, 'El nombre es requerido').max(50),
    descripcion: zod_1.z.string().optional().nullable(),
    permisos: zod_1.z.array(zod_1.z.number().int().positive()).optional(),
    estado: zod_1.z.enum(['activo', 'inactivo']).optional().default('activo')
});
exports.updateRolSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(50).optional(),
    descripcion: zod_1.z.string().max(255).optional().nullable(),
    estado: zod_1.z.enum(['activo', 'inactivo']).optional(),
    permisos: zod_1.z.array(zod_1.z.number().int().positive()).optional(),
});
exports.rolIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive()
});
