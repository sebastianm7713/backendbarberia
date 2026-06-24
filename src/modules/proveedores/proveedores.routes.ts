import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./proveedores.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Proveedores'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Proveedores'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Proveedores'), crear);
router.put("/:id", verifyToken, authorizeByModule('Proveedores'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Proveedores'), eliminar);

export default router;