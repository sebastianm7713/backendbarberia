import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./clientes.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Authenticated users can access clients, but controller filters client users to their own record
router.get("/", verifyToken, obtenerTodos);
router.get("/:id", verifyToken, obtenerPorId);
// Only admin can create/update/delete
router.post("/", verifyToken, authorizeByModule('Clientes'), crear);
router.put("/:id", verifyToken, authorizeByModule('Clientes'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Clientes'), eliminar);

export default router;