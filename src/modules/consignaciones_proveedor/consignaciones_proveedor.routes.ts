import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./consignaciones_proveedor.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Consignaciones'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Consignaciones'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Consignaciones'), crear);
router.put("/:id", verifyToken, authorizeByModule('Consignaciones'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Consignaciones'), eliminar);

export default router;