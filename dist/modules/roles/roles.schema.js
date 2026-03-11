"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolIdSchema = exports.updateRolSchema = exports.createRolSchema = void 0;
const zod_1 = require("zod");
exports.createRolSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(50),
    descripcion: zod_1.z.string().max(255).optional(),
});
exports.updateRolSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(50).optional(),
    descripcion: zod_1.z.string().max(255).optional(),
});
exports.rolIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
