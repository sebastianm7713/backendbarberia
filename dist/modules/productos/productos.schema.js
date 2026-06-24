"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoIdSchema = exports.updateProductoSchema = exports.createProductoSchema = void 0;
const zod_1 = require("zod");
exports.createProductoSchema = zod_1.z.object({
    id_categoria: zod_1.z.coerce.number().int().positive().optional().nullable(),
    id_marca: zod_1.z.coerce.number().int().positive().optional().nullable(),
    nombre: zod_1.z.string().min(1).max(200),
    precio: zod_1.z.coerce.number().positive(),
    descripcion: zod_1.z.string().max(400).optional().nullable(),
    stock: zod_1.z.coerce.number().int().nonnegative().optional().default(0),
    fecha_vencimiento: zod_1.z.string().optional().nullable(),
    img: zod_1.z.string().max(10000000).optional().nullable(),
    estado: zod_1.z.enum(['activo', 'inactivo']).optional().default('activo'),
    tipo_adquisicion: zod_1.z.enum(['compra_directa', 'consignacion']).optional().default('compra_directa'),
    id_proveedor: zod_1.z.coerce.number().int().positive().optional().nullable(),
    // Campos adicionales para consignación
    consignacion_data: zod_1.z.object({
        cantidad_recibida: zod_1.z.number().int().positive(),
        precio_proveedor: zod_1.z.number().positive(),
        precio_venta: zod_1.z.number().positive(),
        fecha_entrega: zod_1.z.string(),
        observaciones: zod_1.z.string().optional(),
    }).optional(),
}).refine((data) => {
    // Si es consignación, debe tener id_proveedor y consignacion_data
    if (data.tipo_adquisicion === 'consignacion') {
        return data.id_proveedor && data.consignacion_data;
    }
    return true;
}, {
    message: "Para productos por consignación se requiere id_proveedor y consignacion_data",
    path: ["tipo_adquisicion"],
});
exports.updateProductoSchema = zod_1.z.object({
    id_categoria: zod_1.z.coerce.number().int().positive().optional().nullable(),
    id_marca: zod_1.z.coerce.number().int().positive().optional().nullable(),
    nombre: zod_1.z.string().min(1).max(200).optional(),
    precio: zod_1.z.coerce.number().positive().optional(),
    descripcion: zod_1.z.string().max(400).optional().nullable(),
    stock: zod_1.z.coerce.number().int().nonnegative().optional(),
    fecha_vencimiento: zod_1.z.string().optional().nullable(),
    img: zod_1.z.string().max(10000000).optional().nullable(),
    estado: zod_1.z.enum(['activo', 'inactivo']).optional(),
    tipo_adquisicion: zod_1.z.enum(['compra_directa', 'consignacion']).optional(),
    id_proveedor: zod_1.z.coerce.number().int().positive().optional().nullable(),
});
exports.productoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
