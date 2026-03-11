"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consignacionIdSchema = exports.updateConsignacionSchema = exports.createConsignacionSchema = void 0;
const zod_1 = require("zod");
exports.createConsignacionSchema = zod_1.z.object({
    id_proveedor: zod_1.z.number().int().positive(),
    id_producto: zod_1.z.number().int().positive(),
    cantidad_recibida: zod_1.z.number().int().positive(),
    precio_proveedor: zod_1.z.number().positive(),
    precio_venta: zod_1.z.number().positive(),
    fecha_entrega: zod_1.z.string(),
    observaciones: zod_1.z.string().optional(),
});
exports.updateConsignacionSchema = zod_1.z.object({
    cantidad_vendida: zod_1.z.number().int().optional(),
    fecha_pago: zod_1.z.string().optional(),
    estado: zod_1.z.enum(["pendiente", "pagado", "devuelto"]).optional(),
    observaciones: zod_1.z.string().optional(),
});
exports.consignacionIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
