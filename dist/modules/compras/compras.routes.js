"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compras_controller_1 = require("./compras.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// Solo admin o encargado (ejemplo rol 1 y 2)
router.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), compras_controller_1.crear);
router.get("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), compras_controller_1.obtenerTodos);
router.get("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), compras_controller_1.obtenerPorId);
router.put("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), compras_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), compras_controller_1.eliminar);
exports.default = router;
