import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./barberos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// Admin can manage, barberos can view
router.get("/", verifyToken, authorizeRoles(1, 2), obtenerTodos);
router.get("/:id", verifyToken, authorizeRoles(1, 2), obtenerPorId);
router.post("/", verifyToken, authorizeRoles(1), crear);
router.put("/:id", verifyToken, authorizeRoles(1), actualizar);
router.delete("/:id", verifyToken, authorizeRoles(1), eliminar);

export default router;