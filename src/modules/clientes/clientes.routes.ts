import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./clientes.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// Admin and barberos can view clients
router.get("/", verifyToken, authorizeRoles(1, 2), obtenerTodos);
router.get("/:id", verifyToken, authorizeRoles(1, 2), obtenerPorId);
// Only admin can create/update/delete
router.post("/", verifyToken, authorizeRoles(1), crear);
router.put("/:id", verifyToken, authorizeRoles(1), actualizar);
router.delete("/:id", verifyToken, authorizeRoles(1), eliminar);

export default router;