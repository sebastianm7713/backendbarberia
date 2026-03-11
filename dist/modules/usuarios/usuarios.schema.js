"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioIdSchema = exports.updateUsuarioSchema = exports.createUsuarioSchema = void 0;
const zod_1 = require("zod");
exports.createUsuarioSchema = zod_1.z.object({
    id_rol: zod_1.z.number().int().positive(),
    id_tipo_documento: zod_1.z.number().int().positive(),
    numero_documento: zod_1.z.string().min(1).max(50),
    nombre: zod_1.z.string().min(1).max(150),
    email: zod_1.z.string().email().max(150).optional(),
    telefono: zod_1.z.string().max(30).optional(),
    direccion: zod_1.z.string().max(250).optional(),
    contrasena: zod_1.z.string().min(6),
    img: zod_1.z.string().max(250).optional(),
});
exports.updateUsuarioSchema = zod_1.z.object({
    id_rol: zod_1.z.number().int().positive().optional(),
    nombre: zod_1.z.string().min(1).max(150).optional(),
    email: zod_1.z.string().email().max(150).optional(),
    telefono: zod_1.z.string().max(30).optional(),
    direccion: zod_1.z.string().max(250).optional(),
    img: zod_1.z.string().max(250).optional(),
});
exports.usuarioIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
