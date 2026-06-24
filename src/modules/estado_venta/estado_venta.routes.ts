import { Router } from "express";
import { listar, obtenerPorId } from "./estado_venta.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Listar estados de venta
router.get("/", verifyToken, authorizeByModule('Estado Venta'), listar);

// Obtener estado de venta por ID
router.get("/:id", verifyToken, authorizeByModule('Estado Venta'), obtenerPorId);

export default router;