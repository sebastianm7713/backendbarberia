"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compraIdSchema = exports.updateCompraSchema = exports.createCompraSchema = void 0;
const zod_1 = require("zod");
exports.createCompraSchema = zod_1.z.object({
    id_proveedor: zod_1.z.number().int().positive(),
    detalles: zod_1.z.array(zod_1.z.object({
        id_producto: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
        costo_unitario: zod_1.z.number().positive(),
    })),
});
exports.updateCompraSchema = zod_1.z.object({
    id_proveedor: zod_1.z.number().int().positive().optional(),
    total: zod_1.z.number().positive().optional(),
});
exports.compraIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
