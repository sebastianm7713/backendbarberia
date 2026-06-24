import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./devoluciones_proveedor.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Devoluciones Proveedor'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Devoluciones Proveedor'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Devoluciones Proveedor'), crear);
router.put("/:id", verifyToken, authorizeByModule('Devoluciones Proveedor'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Devoluciones Proveedor'), eliminar);

export default router;