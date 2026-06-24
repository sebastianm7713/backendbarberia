"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicioIdSchema = exports.updateServicioSchema = exports.createServicioSchema = void 0;
const zod_1 = require("zod");
exports.createServicioSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(200),
    descripcion: zod_1.z.string().max(400).optional(),
    precio: zod_1.z.number().positive(),
    duracion: zod_1.z.number().int().positive(),
    porcentaje_barbero: zod_1.z.number().min(0).max(100),
});
exports.updateServicioSchema = exports.createServicioSchema.partial();
exports.servicioIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
