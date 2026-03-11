import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./devoluciones.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validation.middleware";
import * as schema from "./devoluciones.schema";

const router = Router();

// sólo admin puede manipular devoluciones
router.get("/", verifyToken, authorizeRoles(1), obtenerTodos);
router.get("/:id", verifyToken, authorizeRoles(1), obtenerPorId);
router.post("/", verifyToken, authorizeRoles(1), validate(schema.createDevolucionSchema), crear);
router.put("/:id", verifyToken, authorizeRoles(1), validate(schema.updateDevolucionSchema), actualizar);
router.delete("/:id", verifyToken, authorizeRoles(1), eliminar);

export default router;
