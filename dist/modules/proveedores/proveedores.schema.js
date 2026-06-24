"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveedorIdSchema = exports.updateProveedorSchema = exports.createProveedorSchema = void 0;
const zod_1 = require("zod");
exports.createProveedorSchema = zod_1.z.object({
    id_marca: zod_1.z.number().int().positive().optional().nullable(),
    id_tipo_documento: zod_1.z.number().int().positive(),
    numero_documento: zod_1.z.string().min(1).max(50),
    nombre: zod_1.z.string().min(1).max(200),
    representante: zod_1.z.string().max(150).optional().nullable(),
    telefono: zod_1.z.string().max(30).optional().nullable(),
    correo: zod_1.z.string().email().max(150).optional().nullable(),
    nit: zod_1.z.string().max(50).optional().nullable(),
    estado: zod_1.z.enum(['Activo', 'Inactivo']).default('Activo'),
});
exports.updateProveedorSchema = zod_1.z.object({
    id_marca: zod_1.z.number().int().positive().optional().nullable(),
    id_tipo_documento: zod_1.z.number().int().positive().optional(),
    numero_documento: zod_1.z.string().min(1).max(50).optional(),
    nombre: zod_1.z.string().min(1).max(200).optional(),
    representante: zod_1.z.string().max(150).optional().nullable(),
    telefono: zod_1.z.string().max(30).optional().nullable(),
    correo: zod_1.z.string().email().max(150).optional().nullable(),
    nit: zod_1.z.string().max(50).optional().nullable(),
    estado: zod_1.z.enum(['Activo', 'Inactivo']).optional(),
});
exports.proveedorIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
