"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roles_controller_1 = require("./roles.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Solo admin
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.obtenerTodos);
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.obtenerPorId);
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.actualizar);
router.patch("/:id/estado", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.actualizarEstado);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Roles'), roles_controller_1.eliminar);
exports.default = router;
