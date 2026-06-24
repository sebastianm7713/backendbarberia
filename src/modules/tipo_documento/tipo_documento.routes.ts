import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./tipo_documento.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Tipo Documento'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Tipo Documento'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Tipo Documento'), crear);
router.put("/:id", verifyToken, authorizeByModule('Tipo Documento'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Tipo Documento'), eliminar);

export default router;