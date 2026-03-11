"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devolucionProveedorIdSchema = exports.updateDevolucionProveedorSchema = exports.createDevolucionProveedorSchema = void 0;
const zod_1 = require("zod");
exports.createDevolucionProveedorSchema = zod_1.z.object({
    id_detalle_compra: zod_1.z.number().int().positive(),
    id_proveedor: zod_1.z.number().int().positive(),
    motivo: zod_1.z.string().optional(),
    cantidad_devuelta: zod_1.z.number().int().positive(),
});
exports.updateDevolucionProveedorSchema = zod_1.z.object({
    motivo: zod_1.z.string().optional(),
    cantidad_devuelta: zod_1.z.number().int().positive().optional(),
    estado: zod_1.z.enum(["pendiente", "aceptada", "rechazada"]).optional(),
});
exports.devolucionProveedorIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
