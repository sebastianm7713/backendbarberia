import { Router } from "express";
import {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
} from "./productos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Public catalog
router.get("/", listar);
router.get("/:id", obtenerPorId);

// Admin-only modifications
router.post("/", verifyToken, authorizeByModule('Productos'), crear);
router.put("/:id", verifyToken, authorizeByModule('Productos'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Productos'), eliminar);

export default router;