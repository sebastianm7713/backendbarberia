import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, actualizarEstado, eliminar } from "./roles.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Solo admin
router.get("/", verifyToken, authorizeByModule('Roles'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Roles'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Roles'), crear);
router.put("/:id", verifyToken, authorizeByModule('Roles'), actualizar);
router.patch("/:id/estado", verifyToken, authorizeByModule('Roles'), actualizarEstado);
router.delete("/:id", verifyToken, authorizeByModule('Roles'), eliminar);

export default router;