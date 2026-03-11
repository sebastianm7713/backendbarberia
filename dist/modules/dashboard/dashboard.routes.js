"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get("/hoy", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1, 2), dashboard_controller_1.obtenerDashboardHoy);
exports.default = router;
