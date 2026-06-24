"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriaIdSchema = exports.updateCategoriaSchema = exports.createCategoriaSchema = void 0;
const zod_1 = require("zod");
exports.createCategoriaSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, 'El nombre es requerido'),
    descripcion: zod_1.z.string().optional(),
    estado: zod_1.z.string().optional(),
});
exports.updateCategoriaSchema = exports.createCategoriaSchema.partial();
exports.categoriaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
