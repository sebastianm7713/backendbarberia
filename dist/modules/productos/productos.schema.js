"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoIdSchema = exports.updateProductoSchema = exports.createProductoSchema = void 0;
const zod_1 = require("zod");
exports.createProductoSchema = zod_1.z.object({
    id_categoria: zod_1.z.number().int().positive().optional(),
    id_marca: zod_1.z.number().int().positive().optional(),
    nombre: zod_1.z.string().min(1).max(200),
    precio: zod_1.z.number().positive(),
    descripcion: zod_1.z.string().max(400).optional(),
    stock: zod_1.z.number().int().nonnegative().optional(),
    fecha_vencimiento: zod_1.z.string().datetime().optional(),
    img: zod_1.z.string().max(250).optional(),
});
exports.updateProductoSchema = zod_1.z.object({
    id_categoria: zod_1.z.number().int().positive().optional(),
    id_marca: zod_1.z.number().int().positive().optional(),
    nombre: zod_1.z.string().min(1).max(200).optional(),
    precio: zod_1.z.number().positive().optional(),
    descripcion: zod_1.z.string().max(400).optional(),
    stock: zod_1.z.number().int().nonnegative().optional(),
    fecha_vencimiento: zod_1.z.string().datetime().optional(),
    img: zod_1.z.string().max(250).optional(),
});
exports.productoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
