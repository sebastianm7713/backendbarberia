import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./marcas.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// public catalog endpoints (anyone can list/inspect brands)
router.get("/", obtenerTodos);
router.get("/:id", obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Marcas'), crear);
router.put("/:id", verifyToken, authorizeByModule('Marcas'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Marcas'), eliminar);

export default router;