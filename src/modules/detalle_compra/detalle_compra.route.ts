import { Router } from "express";
import { crear, obtenerTodos, obtenerPorId, obtenerPorCompra, actualizar, eliminar } from "./detalle_compra.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Solo admin o encargado
router.post(
  "/",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  crear
);

router.get(
  "/",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  obtenerTodos
);

router.get(
  "/compra/:id",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  obtenerPorCompra
);

router.get(
  "/:id",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  obtenerPorId
);

router.put(
  "/:id",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  actualizar
);

router.delete(
  "/:id",
  verifyToken,
  authorizeByModule('Detalle Compra'),
  eliminar
);

export default router;