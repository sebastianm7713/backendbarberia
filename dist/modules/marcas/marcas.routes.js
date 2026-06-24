"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marcas_controller_1 = require("./marcas.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// public catalog endpoints (anyone can list/inspect brands)
router.get("/", marcas_controller_1.obtenerTodos);
router.get("/:id", marcas_controller_1.obtenerPorId);
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Marcas'), marcas_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Marcas'), marcas_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Marcas'), marcas_controller_1.eliminar);
exports.default = router;
