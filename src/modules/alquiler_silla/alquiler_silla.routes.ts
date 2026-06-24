import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./alquiler_silla.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Alquiler Silla'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Alquiler Silla'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Alquiler Silla'), crear);
router.put("/:id", verifyToken, authorizeByModule('Alquiler Silla'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Alquiler Silla'), eliminar);

export default router;