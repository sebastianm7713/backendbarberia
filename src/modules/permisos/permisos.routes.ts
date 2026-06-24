import { Router } from "express";
import { obtenerTodos, obtenerPermisosEstructurados, seedPermisosDefault, obtenerPorId, crear, actualizar, eliminar } from "./permisos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Permisos'), obtenerTodos);
router.get("/tree", verifyToken, authorizeByModule('Permisos'), obtenerPermisosEstructurados);
router.post("/seed-defaults", verifyToken, authorizeByModule('Permisos'), seedPermisosDefault);
router.get("/:id", verifyToken, authorizeByModule('Permisos'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Permisos'), crear);
router.put("/:id", verifyToken, authorizeByModule('Permisos'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Permisos'), eliminar);

export default router;