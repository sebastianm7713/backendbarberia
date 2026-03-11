import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./permisos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

router.get("/", verifyToken, authorizeRoles(1), obtenerTodos);
router.get("/:id", verifyToken, authorizeRoles(1), obtenerPorId);
router.post("/", verifyToken, authorizeRoles(1), crear);
router.put("/:id", verifyToken, authorizeRoles(1), actualizar);
router.delete("/:id", verifyToken, authorizeRoles(1), eliminar);

export default router;