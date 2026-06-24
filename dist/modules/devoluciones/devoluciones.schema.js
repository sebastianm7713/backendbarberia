"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productosPorProveedorSchema = exports.devolucionIdSchema = exports.updateDevolucionSchema = exports.createDevolucionSchema = void 0;
const zod_1 = require("zod");
exports.createDevolucionSchema = zod_1.z.object({
    id_detalle_producto: zod_1.z.number().int().positive(),
    cantidad: zod_1.z.number().int().positive(),
    motivo: zod_1.z.string().optional(),
    remitido: zod_1.z.enum(["stock", "proveedor"]),
    id_proveedor: zod_1.z.number().int().positive().optional(),
}).refine((data) => {
    // Si remitido es 'proveedor', debe tener id_proveedor
    if (data.remitido === 'proveedor') {
        return data.id_proveedor !== undefined;
    }
    return true;
}, {
    message: "Para devoluciones a proveedor se requiere id_proveedor",
    path: ["id_proveedor"],
});
exports.updateDevolucionSchema = zod_1.z.object({
    cantidad: zod_1.z.number().int().positive().optional(),
    motivo: zod_1.z.string().optional(),
    remitido: zod_1.z.enum(["stock", "proveedor"]).optional(),
    id_proveedor: zod_1.z.number().int().positive().optional(),
});
exports.devolucionIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
exports.productosPorProveedorSchema = zod_1.z.object({
    id_proveedor: zod_1.z.number().int().positive(),
});
