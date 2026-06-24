import { Router } from "express";
import { crear, obtenerTodos, obtenerPorId, obtenerPorEstado, actualizar, eliminar } from "./compras.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// Solo admin o encargado (ejemplo rol 1 y 2)
router.post(
  "/",
  verifyToken,
  authorizeByModule('Compras'),
  crear
);

router.get(
  "/",
  verifyToken,
  authorizeByModule('Compras'),
  obtenerTodos
);

router.get(
  "/estado/:estado",
  verifyToken,
  authorizeByModule('Compras'),
  obtenerPorEstado
);

router.get(
  "/:id",
  verifyToken,
  authorizeByModule('Compras'),
  obtenerPorId
);

router.put(
  "/:id",
  verifyToken,
  authorizeByModule('Compras'),
  actualizar
);

router.delete(
  "/:id",
  verifyToken,
  authorizeByModule('Compras'),
  eliminar
);

export default router;