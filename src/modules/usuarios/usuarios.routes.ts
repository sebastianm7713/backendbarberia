import { Router } from "express";
import * as controller from "./usuarios.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = Router();

// listing is admin-only
router.get("/", verifyToken, authorizeByModule('Usuarios'), controller.getUsuarios);
router.get("/:id", verifyToken, authorizeByModule('Usuarios'), controller.obtenerUsuarioPorId);

// allow registration without auth (if needed)
router.post("/", verifyToken, authorizeByModule('Usuarios'), controller.crearUsuario);

// admin modifications
router.put("/:id", verifyToken, authorizeByModule('Usuarios'), controller.actualizarUsuario);
router.delete("/:id", verifyToken, authorizeByModule('Usuarios'), controller.eliminarUsuario);

export default router;