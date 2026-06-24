"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorias_productos_controller_1 = require("./categorias_productos.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = (0, express_1.Router)();
// acceso restringido: solo usuarios autenticados con permisos de admin pueden gestionar categorías de productos
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Categorías de Productos'), categorias_productos_controller_1.obtenerTodos);
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Categorías de Productos'), categorias_productos_controller_1.obtenerPorId);
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Categorías de Productos'), categorias_productos_controller_1.crear);
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Categorías de Productos'), categorias_productos_controller_1.actualizar);
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Categorías de Productos'), categorias_productos_controller_1.eliminar);
exports.default = router;
