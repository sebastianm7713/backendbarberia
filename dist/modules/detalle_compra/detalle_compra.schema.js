"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleIdSchema = exports.updateDetalleCompraSchema = exports.createDetalleCompraSchema = void 0;
const zod_1 = require("zod");
exports.createDetalleCompraSchema = zod_1.z.object({
    id_compra: zod_1.z.number().int().positive(),
    id_producto: zod_1.z.number().int().positive(),
    cantidad: zod_1.z.number().int().positive(),
    costo_unitario: zod_1.z.number().positive(),
});
exports.updateDetalleCompraSchema = zod_1.z.object({
    id_producto: zod_1.z.number().int().positive().optional(),
    cantidad: zod_1.z.number().int().positive().optional(),
    costo_unitario: zod_1.z.number().positive().optional(),
});
exports.detalleIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
