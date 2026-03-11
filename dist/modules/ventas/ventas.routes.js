"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventas_controller_1 = require("./ventas.controller");
const ventas_controller_2 = require("./ventas.controller");
const ventas_controller_3 = require("./ventas.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// Admin y Barbero pueden vender
router.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), ventas_controller_1.crear);
router.get("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), ventas_controller_2.listar);
router.get("/:id", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), ventas_controller_3.obtenerPorId);
exports.default = router;
