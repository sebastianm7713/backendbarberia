import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./disponibilidad_excepcion.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

router.get("/", verifyToken, authorizeByModule('Disponibilidad Excepcion'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Disponibilidad Excepcion'), obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Disponibilidad Excepcion'), crear);
router.put("/:id", verifyToken, authorizeByModule('Disponibilidad Excepcion'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Disponibilidad Excepcion'), eliminar);

export default router;