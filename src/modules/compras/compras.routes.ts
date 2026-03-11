import { Router } from "express";
import { crear, obtenerTodos, obtenerPorId, actualizar, eliminar } from "./compras.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// Solo admin o encargado (ejemplo rol 1 y 2)
router.post(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  crear
);

router.get(
  "/",
  verifyToken,
  authorizeRoles(1, 2),
  obtenerTodos
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2),
  obtenerPorId
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2),
  actualizar
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(1, 2),
  eliminar
);

export default router;