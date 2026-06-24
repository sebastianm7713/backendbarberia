"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estado_venta_controller_1 = require("./estado_venta.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Listar estados de venta
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Estado Venta'), estado_venta_controller_1.listar);
// Obtener estado de venta por ID
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Estado Venta'), estado_venta_controller_1.obtenerPorId);
exports.default = router;
