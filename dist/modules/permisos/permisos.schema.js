"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permisoIdSchema = exports.updatePermisoSchema = exports.createPermisoSchema = void 0;
const zod_1 = require("zod");
exports.createPermisoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(100),
    descripcion: zod_1.z.string().min(1).max(255),
});
exports.updatePermisoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(100).optional(),
    descripcion: zod_1.z.string().max(255).optional(),
});
exports.permisoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
