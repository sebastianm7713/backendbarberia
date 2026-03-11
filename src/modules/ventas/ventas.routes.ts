import { Router } from "express";
import { crear } from "./ventas.controller";
import { listar } from "./ventas.controller";
import { obtenerPorId } from "./ventas.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// Admin y Barbero pueden vender
router.post("/", verifyToken, authorizeRoles(1, 2), crear);
router.get("/", verifyToken, authorizeRoles(1, 2), listar);
router.get("/:id", verifyToken, authorizeRoles(1, 2), obtenerPorId);
export default router;