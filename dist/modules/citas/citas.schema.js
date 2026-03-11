"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citaIdSchema = exports.updateCitaEstadoSchema = exports.createCitaSchema = void 0;
const zod_1 = require("zod");
exports.createCitaSchema = zod_1.z.object({
    id_cliente: zod_1.z.number().int().positive(),
    id_barbero: zod_1.z.number().int().positive(),
    id_servicio: zod_1.z.number().int().positive().optional(),
    fecha: zod_1.z.string().regex(/\d{4}-\d{2}-\d{2}/),
    hora: zod_1.z.string().regex(/\d{2}:\d{2}/),
});
exports.updateCitaEstadoSchema = zod_1.z.object({
    estado: zod_1.z.enum(["pendiente", "confirmada", "completado", "cancelado"]),
});
exports.citaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
