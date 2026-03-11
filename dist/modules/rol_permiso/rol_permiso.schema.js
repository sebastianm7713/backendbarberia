"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRolPermisoSchema = exports.rolPermisoSchema = void 0;
const zod_1 = require("zod");
exports.rolPermisoSchema = zod_1.z.object({
    id_rol: zod_1.z.number().int().positive('ID rol requerido'),
    id_permiso: zod_1.z.number().int().positive('ID permiso requerido'),
});
exports.createRolPermisoSchema = exports.rolPermisoSchema;
