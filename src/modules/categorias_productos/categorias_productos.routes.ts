import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./categorias_productos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// acceso restringido: solo usuarios autenticados con permisos de admin pueden gestionar categorías de productos
router.get("/", verifyToken, authorizeByModule('Categorías de Productos'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Categorías de Productos'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Categorías de Productos'), crear);
router.put("/:id", verifyToken, authorizeByModule('Categorías de Productos'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Categorías de Productos'), eliminar);

export default router;