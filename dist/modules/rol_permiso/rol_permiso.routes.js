"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_permiso_controller_1 = require("./rol_permiso.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Rol Permiso')); // Solo admin-equivalente via permisos
router.get('/', rol_permiso_controller_1.rolPermisoController.getAll);
router.get('/rol/:id_rol', rol_permiso_controller_1.rolPermisoController.getByRolId);
router.post('/', rol_permiso_controller_1.rolPermisoController.create);
router.delete('/rol/:id_rol', rol_permiso_controller_1.rolPermisoController.deleteByRolId);
router.delete('/:id_rol/:id_permiso', rol_permiso_controller_1.rolPermisoController.delete);
exports.default = router;
