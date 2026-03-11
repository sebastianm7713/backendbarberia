"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveedorIdSchema = exports.updateProveedorSchema = exports.createProveedorSchema = void 0;
const zod_1 = require("zod");
exports.createProveedorSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1),
    contacto: zod_1.z.string().optional(),
    telefono: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    direccion: zod_1.z.string().optional(),
});
exports.updateProveedorSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).optional(),
    contacto: zod_1.z.string().optional(),
    telefono: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    direccion: zod_1.z.string().optional(),
});
exports.proveedorIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
