"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_controller_1 = require("./productos.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Public catalog
router.get("/", productos_controller_1.listar);
router.get("/:id", productos_controller_1.obtenerPorId);
// Admin-only modifications
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Productos'), productos_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Productos'), productos_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Productos'), productos_controller_1.eliminar);
exports.default = router;
