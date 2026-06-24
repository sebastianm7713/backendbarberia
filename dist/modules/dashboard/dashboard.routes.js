"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
router.get("/hoy", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Dashboard'), dashboard_controller_1.obtenerDashboardHoy);
exports.default = router;
