"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controller_1 = require("./clientes.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// Admin and barberos can view clients
router.get("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), clientes_controller_1.obtenerTodos);
router.get("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), clientes_controller_1.obtenerPorId);
// Only admin can create/update/delete
router.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), clientes_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), clientes_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), clientes_controller_1.eliminar);
exports.default = router;
