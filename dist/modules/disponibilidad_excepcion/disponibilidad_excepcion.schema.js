"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disponibilidadIdSchema = exports.updateDisponibilidadSchema = exports.createDisponibilidadSchema = void 0;
const zod_1 = require("zod");
exports.createDisponibilidadSchema = zod_1.z.object({
    id_barbero: zod_1.z.number().int().positive(),
    fecha: zod_1.z.string(),
    estado: zod_1.z.enum(["ausente", "cambio_horario", "descanso", "normal"]),
    motivo: zod_1.z.string().min(1),
    hora_inicio: zod_1.z.string(),
    hora_fin: zod_1.z.string(),
});
exports.updateDisponibilidadSchema = zod_1.z.object({
    estado: zod_1.z.enum(["ausente", "cambio_horario", "descanso", "normal"]).optional(),
    motivo: zod_1.z.string().optional(),
    hora_inicio: zod_1.z.string().optional(),
    hora_fin: zod_1.z.string().optional(),
});
exports.disponibilidadIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
