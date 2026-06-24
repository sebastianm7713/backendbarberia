"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBarberoSchema = exports.createBarberoSchema = exports.barberoIdSchema = void 0;
const zod_1 = require("zod");
exports.barberoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive('ID debe ser un número positivo'),
});
exports.createBarberoSchema = zod_1.z.object({
    id_usuario: zod_1.z.number().int().positive('id_usuario es requerido'),
    tipo_contrato: zod_1.z.enum(['porcentaje', 'alquiler']),
    porcentaje_ganancia: zod_1.z
        .number()
        .min(1, 'Porcentaje mínimo es 1')
        .max(100, 'Porcentaje máximo es 100')
        .nullable()
        .optional(),
    hora_inicio: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'hora_inicio debe tener formato HH:MM'),
    hora_fin: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'hora_fin debe tener formato HH:MM'),
    estado: zod_1.z
        .enum(['Activo', 'Inactivo'])
        .optional()
        .default('Activo'),
});
exports.updateBarberoSchema = exports.createBarberoSchema.partial();
