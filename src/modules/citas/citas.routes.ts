import { Router } from "express";
import { crear, listar, actualizarEstado, obtenerPorId } from "./citas.controller";
import { validate } from "../../middleware/validation.middleware";
import * as schema from "./citas.schema";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeRoles } from "../../middleware/role.middleware";

const router = Router();

// Crear cita
router.post("/", verifyToken, authorizeRoles(1,2), validate(schema.createCitaSchema), crear);

// Listar citas
router.get("/", verifyToken, authorizeRoles(1,2), listar);

// Cambiar estado
router.put("/:id", verifyToken, authorizeRoles(1,2), validate(schema.updateCitaEstadoSchema), actualizarEstado);

router.get("/:id", verifyToken, authorizeRoles(1,2), obtenerPorId);

export default router;