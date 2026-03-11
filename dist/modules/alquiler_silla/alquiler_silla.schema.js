"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alquilerIdSchema = exports.updateAlquilerSchema = exports.createAlquilerSchema = void 0;
const zod_1 = require("zod");
exports.createAlquilerSchema = zod_1.z.object({
    id_barbero: zod_1.z.number().int().positive(),
    monto: zod_1.z.number().positive(),
    periodo: zod_1.z.enum(["diario", "semanal", "mensual"]),
});
exports.updateAlquilerSchema = zod_1.z.object({
    monto: zod_1.z.number().positive().optional(),
    periodo: zod_1.z.enum(["diario", "semanal", "mensual"]).optional(),
    estado: zod_1.z.string().optional(),
});
exports.alquilerIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
