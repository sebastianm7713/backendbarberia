"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controller_1 = require("./clientes.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Authenticated users can access clients, but controller filters client users to their own record
router.get("/", auth_middleware_1.verifyToken, clientes_controller_1.obtenerTodos);
router.get("/:id", auth_middleware_1.verifyToken, clientes_controller_1.obtenerPorId);
// Only admin can create/update/delete
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Clientes'), clientes_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Clientes'), clientes_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Clientes'), clientes_controller_1.eliminar);
exports.default = router;
