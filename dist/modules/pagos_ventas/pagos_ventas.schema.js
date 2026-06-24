"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagoVentaIdSchema = exports.updatePagoVentaSchema = exports.createPagoVentaSchema = void 0;
const zod_1 = require("zod");
exports.createPagoVentaSchema = zod_1.z.object({
    id_venta: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().int().positive()),
    monto_pagado: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().positive()),
    fecha_pago: zod_1.z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), zod_1.z.string().datetime().optional()),
    metodo_pago: zod_1.z.string().min(1).max(50),
    referencia: zod_1.z.string().min(1).max(100),
});
exports.updatePagoVentaSchema = zod_1.z.object({
    monto_pagado: zod_1.z.preprocess((value) => (value !== undefined ? Number(value) : undefined), zod_1.z.number().positive().optional()),
    fecha_pago: zod_1.z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), zod_1.z.string().datetime().optional()),
    metodo_pago: zod_1.z.string().min(1).max(50).optional(),
    referencia: zod_1.z.string().min(1).max(100).optional(),
});
exports.pagoVentaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
