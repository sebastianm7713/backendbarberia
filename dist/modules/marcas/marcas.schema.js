"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaIdSchema = exports.updateMarcaSchema = exports.createMarcaSchema = void 0;
const zod_1 = require("zod");
exports.createMarcaSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(150),
});
exports.updateMarcaSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(150).optional(),
});
exports.marcaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
