"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_permiso_controller_1 = require("./rol_permiso.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, (0, role_middleware_1.authorizeRoles)(1)); // Solo admin
router.get('/', rol_permiso_controller_1.rolPermisoController.getAll);
router.get('/rol/:id_rol', rol_permiso_controller_1.rolPermisoController.getByRolId);
router.get('/permiso/:id_permiso', rol_permiso_controller_1.rolPermisoController.getByPermisoId);
router.post('/', rol_permiso_controller_1.rolPermisoController.create);
router.delete('/:id_rol/:id_permiso', rol_permiso_controller_1.rolPermisoController.delete);
router.delete('/rol/:id_rol', rol_permiso_controller_1.rolPermisoController.deleteByRolId);
exports.default = router;
