"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barberoIdSchema = exports.updateBarberoSchema = exports.createBarberoSchema = void 0;
const zod_1 = require("zod");
exports.createBarberoSchema = zod_1.z.object({
    id_usuario: zod_1.z.number().int().positive(),
    tipo_contrato: zod_1.z.enum(["porcentaje", "alquiler"]),
    porcentaje_ganancia: zod_1.z.number().min(0).max(100).optional(),
    hora_inicio: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    hora_fin: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
});
exports.updateBarberoSchema = zod_1.z.object({
    tipo_contrato: zod_1.z.enum(["porcentaje", "alquiler"]).optional(),
    porcentaje_ganancia: zod_1.z.number().min(0).max(100).optional(),
    hora_inicio: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    hora_fin: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    estado: zod_1.z.string().optional(),
});
exports.barberoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
