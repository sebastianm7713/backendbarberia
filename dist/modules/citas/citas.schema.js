"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citaIdSchema = exports.updateCitaSchema = exports.updateCitaEstadoSchema = exports.createCitaLandingSchema = exports.createCitaSchema = void 0;
const zod_1 = require("zod");
exports.createCitaSchema = zod_1.z.object({
    id_cliente: zod_1.z.number().int().positive(),
    id_barbero: zod_1.z.number().int().positive(),
    id_servicio: zod_1.z.number().int().positive().optional(),
    fecha: zod_1.z.string().regex(/\d{4}-\d{2}-\d{2}/),
    hora: zod_1.z.string().regex(/\d{2}:\d{2}/),
    productos: zod_1.z.array(zod_1.z.object({
        id_producto: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
        precio_unitario: zod_1.z.number().positive(),
    })).optional(),
});
exports.createCitaLandingSchema = zod_1.z.object({
    id_barbero: zod_1.z.number().int().positive(),
    id_servicio: zod_1.z.number().int().positive().optional(),
    fecha: zod_1.z.string().regex(/\d{4}-\d{2}-\d{2}/),
    hora: zod_1.z.string().regex(/\d{2}:\d{2}/),
    guest_nombre: zod_1.z.string().min(2).max(200),
    guest_email: zod_1.z.string().email(),
    guest_telefono: zod_1.z.string().min(7).max(20),
    productos: zod_1.z.array(zod_1.z.object({
        id_producto: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
        precio_unitario: zod_1.z.number().positive(),
    })).optional(),
});
exports.updateCitaEstadoSchema = zod_1.z.object({
    estado: zod_1.z.enum(["pendiente", "confirmada", "completado", "cancelado", "en_ejecucion"]),
}).strip();
exports.updateCitaSchema = zod_1.z.object({
    id_cliente: zod_1.z.number().int().positive().optional(),
    id_barbero: zod_1.z.number().int().positive().optional(),
    id_servicio: zod_1.z.number().int().positive().optional(),
    fecha: zod_1.z.string().regex(/\d{4}-\d{2}-\d{2}/).optional(),
    hora: zod_1.z.string().regex(/\d{2}:\d{2}/).optional(),
    estado: zod_1.z.enum(["pendiente", "confirmada", "completado", "cancelado", "en_ejecucion"]).optional(),
    productos: zod_1.z.array(zod_1.z.object({
        id_producto: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
        precio_unitario: zod_1.z.number().positive(),
    })).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Se requiere al menos un campo para actualizar",
});
exports.citaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
