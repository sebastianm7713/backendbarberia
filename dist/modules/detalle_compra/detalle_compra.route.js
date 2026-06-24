"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detalle_compra_controller_1 = require("./detalle_compra.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Solo admin o encargado
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.crear);
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.obtenerTodos);
router.get("/compra/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.obtenerPorCompra);
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.obtenerPorId);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Detalle Compra'), detalle_compra_controller_1.eliminar);
exports.default = router;
