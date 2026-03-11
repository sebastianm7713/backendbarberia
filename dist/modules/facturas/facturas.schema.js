"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facturaIdSchema = exports.createFacturaSchema = void 0;
const zod_1 = require("zod");
exports.createFacturaSchema = zod_1.z.object({
    cliente_id: zod_1.z.number().int().positive(),
    detalles: zod_1.z.array(zod_1.z.object({
        producto_id: zod_1.z.number().int().positive(),
        cantidad: zod_1.z.number().int().positive(),
    })),
});
exports.facturaIdSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
});
