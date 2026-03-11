"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devolucionIdSchema = exports.updateDevolucionSchema = exports.createDevolucionSchema = void 0;
const zod_1 = require("zod");
exports.createDevolucionSchema = zod_1.z.object({
    id_detalle_producto: zod_1.z.number().int().positive(),
    motivo: zod_1.z.string().optional(),
    remitido: zod_1.z.enum(["stock", "proveedor"]),
});
exports.updateDevolucionSchema = zod_1.z.object({
    motivo: zod_1.z.string().optional(),
    remitido: zod_1.z.enum(["stock", "proveedor"]).optional(),
});
exports.devolucionIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
