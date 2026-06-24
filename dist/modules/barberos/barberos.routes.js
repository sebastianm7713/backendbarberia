"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barberos_controller_1 = require("./barberos.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// Authenticated users can view barberos; public endpoint available for unauthenticated access
router.get("/", auth_middleware_1.verifyToken, barberos_controller_1.obtenerTodos);
router.get("/public", barberos_controller_1.obtenerTodos); // Public endpoint for landing page
router.get("/:id", auth_middleware_1.verifyToken, barberos_controller_1.obtenerPorId);
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Barberos'), barberos_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Barberos'), barberos_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Barberos'), barberos_controller_1.eliminar);
exports.default = router;
