"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tipoDocumentoIdSchema = exports.updateTipoDocumentoSchema = exports.createTipoDocumentoSchema = void 0;
const zod_1 = require("zod");
exports.createTipoDocumentoSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1, 'El nombre es requerido'),
    descripcion: zod_1.z.string().optional(),
    estado: zod_1.z.string().default('Activo'),
});
exports.updateTipoDocumentoSchema = exports.createTipoDocumentoSchema.partial();
exports.tipoDocumentoIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
