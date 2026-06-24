"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPagoConsignacionSchema = exports.pagoIdSchema = exports.updatePagoSchema = exports.createPagoSchema = void 0;
const zod_1 = require("zod");
exports.createPagoSchema = zod_1.z.object({
    id_compra: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().int().positive()),
    monto_pagado: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().positive()),
    fecha_pago: zod_1.z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), zod_1.z.string().datetime().optional()),
    metodo_pago: zod_1.z.string().min(1).max(50),
    referencia: zod_1.z.string().min(1).max(100),
});
exports.updatePagoSchema = zod_1.z.object({
    monto_pagado: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().positive().optional()),
    fecha_pago: zod_1.z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), zod_1.z.string().datetime().optional()),
    metodo_pago: zod_1.z.string().min(1).max(50).optional(),
    referencia: zod_1.z.string().min(1).max(100).optional(),
});
exports.pagoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
// Validación especial para pagos de consignación
exports.createPagoConsignacionSchema = zod_1.z.object({
    id_compra: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().int().positive()),
    monto_pagado: zod_1.z.preprocess((value) => Number(value), zod_1.z.number().positive()),
    fecha_pago: zod_1.z.preprocess((value) => (value ? new Date(String(value)).toISOString() : undefined), zod_1.z.string().datetime()), // OBLIGATORIO para consignación
    metodo_pago: zod_1.z.string().min(1).max(50),
    referencia: zod_1.z.string().min(1).max(100),
});
