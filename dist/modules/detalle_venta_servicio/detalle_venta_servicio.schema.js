"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDetalleVentaServicioSchema = exports.detalleVentaServicioSchema = void 0;
const zod_1 = require("zod");
exports.detalleVentaServicioSchema = zod_1.z.object({
    id_venta: zod_1.z.number().int().positive('ID venta requerido'),
    id_servicio: zod_1.z.number().int().positive('ID servicio requerido'),
    id_barbero: zod_1.z.number().int().positive('ID barbero requerido'),
    cantidad: zod_1.z.number().int().positive('Cantidad debe ser mayor a 0'),
    precio_unitario: zod_1.z.number().positive('Precio unitario debe ser mayor a 0'),
    subtotal: zod_1.z.number().positive('Subtotal debe ser mayor a 0'),
});
exports.createDetalleVentaServicioSchema = exports.detalleVentaServicioSchema.omit({ subtotal: true });
