import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./disponibilidad_excepcion.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

router.get("/", verifyToken, authorizeRoles(1, 2), obtenerTodos);
router.get("/:id", verifyToken, authorizeRoles(1, 2), obtenerPorId);
router.post("/", verifyToken, authorizeRoles(1, 2), crear);
router.put("/:id", verifyToken, authorizeRoles(1, 2), actualizar);
router.delete("/:id", verifyToken, authorizeRoles(1, 2), eliminar);

export default router;