import { Router } from "express";
import { crear, obtenerTodos, obtenerPorId, actualizar, eliminar } from "./ventas.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Admin y Barbero pueden vender
router.post("/", verifyToken, authorizeByModule('Ventas'), crear);
router.get("/", verifyToken, authorizeByModule('Ventas'), obtenerTodos);
router.get("/:id", verifyToken, authorizeByModule('Ventas'), obtenerPorId);
router.put("/:id", verifyToken, authorizeByModule('Ventas'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Ventas'), eliminar);
export default router;