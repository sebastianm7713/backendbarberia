import { Router } from "express";
import { obtenerTodos, obtenerPorId, crear, actualizar, eliminar } from "./barberos.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Authenticated users can view barberos; public endpoint available for unauthenticated access
router.get("/", verifyToken, obtenerTodos);
router.get("/public", obtenerTodos); // Public endpoint for landing page
router.get("/:id", verifyToken, obtenerPorId);
router.post("/", verifyToken, authorizeByModule('Barberos'), crear);
router.put("/:id", verifyToken, authorizeByModule('Barberos'), actualizar);
router.delete("/:id", verifyToken, authorizeByModule('Barberos'), eliminar);

export default router;