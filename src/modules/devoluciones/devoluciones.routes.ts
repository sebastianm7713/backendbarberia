import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./devoluciones.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";
import { validate } from "../../middleware/validation.middleware";
import * as schema from "./devoluciones.schema";

const router = Router();

// sólo admin puede manipular devoluciones
router.get("/", verifyToken, authorizeByModule('Devoluciones'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Devoluciones'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Devoluciones'), validate(schema.createDevolucionSchema), crear);
router.put("/:id", verifyToken, authorizeByModule('Devoluciones'), validate(schema.updateDevolucionSchema), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Devoluciones'), eliminar);

export default router;
