"use strict";
// ===== AUTH.SCHEMA.TS (CORREGIDO) =====
// Reemplaza el archivo auth.schema.ts en tu backend con esto
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(3),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    id_tipo_documento: zod_1.z.string().optional(),
    numero_documento: zod_1.z.string().optional(),
    telefono: zod_1.z.string().optional(),
    direccion: zod_1.z.string().optional(),
    img: zod_1.z.string().optional(), // ✅ NUEVO: validación para img (base64)
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
});
