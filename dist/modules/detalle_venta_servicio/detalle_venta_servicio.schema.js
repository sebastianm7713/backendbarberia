"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDetalleVentaServicioSchema = exports.detalleVentaServicioSchema = void 0;
const zod_1 = require("zod");
exports.detalleVentaServicioSchema = zod_1.z.object({
    id_venta: zod_1.z.coerce.number().int().positive('id_venta debe ser un número entero positivo'),
    id_servicio: zod_1.z.coerce.number().int().positive('id_servicio debe ser un número entero positivo'),
    id_barbero: zod_1.z.coerce.number().int().positive('id_barbero debe ser un número entero positivo'),
    cantidad: zod_1.z.coerce.number().int().positive('cantidad debe ser un número entero positivo'),
    precio_unitario: zod_1.z.coerce.number().positive('precio_unitario debe ser un número positivo'),
    subtotal: zod_1.z.coerce.number().positive('subtotal debe ser un número positivo'),
});
exports.createDetalleVentaServicioSchema = exports.detalleVentaServicioSchema.omit({ subtotal: true });
