"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configuracion_landing_controller_1 = require("./configuracion_landing.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// GET - Obtener configuración (público)
router.get('/', configuracion_landing_controller_1.configuracionLandingController.getDefault);
// POST, PUT, DELETE - requieren autenticación y rol de admin (1)
router.post('/', auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Configuración'), configuracion_landing_controller_1.configuracionLandingController.create);
router.put('/:id', auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Configuración'), configuracion_landing_controller_1.configuracionLandingController.update);
router.delete('/:id', auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Configuración'), configuracion_landing_controller_1.configuracionLandingController.delete);
exports.default = router;
