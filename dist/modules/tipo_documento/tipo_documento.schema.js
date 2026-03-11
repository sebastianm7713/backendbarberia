"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoDocumentoIdSchema = exports.updateTipoDocumentoSchema = exports.createTipoDocumentoSchema = void 0;
const zod_1 = require("zod");
exports.createTipoDocumentoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(50),
    descripcion: zod_1.z.string().max(150).optional(),
    estado: zod_1.z.string().max(20).optional(),
});
exports.updateTipoDocumentoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(50).optional(),
    descripcion: zod_1.z.string().max(150).optional(),
    estado: zod_1.z.string().max(20).optional(),
});
exports.tipoDocumentoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
