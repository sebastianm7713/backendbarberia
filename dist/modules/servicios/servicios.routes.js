"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_routes_1 = require("./services.routes");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
// All authenticated users can view services
router.get("/", auth_middleware_1.verifyToken, services_routes_1.getServicios);
// Only admin can create
router.post("/", auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1), services_routes_1.createServicio);
exports.default = router;
