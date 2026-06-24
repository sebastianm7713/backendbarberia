import { Router } from "express";
import { crear, crearDesdeLanding, listar, actualizar, obtenerPorId, eliminar, obtenerHorasDisponibles } from "./citas.controller";
import { validate } from "../../middleware/validation.middleware";
import * as schema from "./citas.schema";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeAnyPermission } from "../../middleware/permission.middleware";

const router = Router();

// Crear cita (permitir usuarios con permiso sobre Citas o reservar)
router.post(
	"/",
	verifyToken,
	authorizeAnyPermission('citas', 'reservar', 'gestión de citas'),
	validate(schema.createCitaSchema),
	crear
);

// Crear cita desde landing sin login
router.post("/landing", validate(schema.createCitaLandingSchema), crearDesdeLanding);

// Listar citas públicas (para landing)
router.get("/public", listar);

// Listar citas (permitir usuarios con permiso de ver citas)
router.get("/", verifyToken, authorizeAnyPermission('citas', 'ver citas', 'ver citas propias'), listar);

// Obtener horas disponibles de un barbero en una fecha (solo usuarios autenticados)
router.get(
	"/disponibilidad/horario",
	verifyToken,
	authorizeAnyPermission('citas', 'ver citas', 'ver citas propias'),
	obtenerHorasDisponibles
);

// Obtener horas disponibles de un barbero en una fecha desde landing sin login
router.get("/landing/disponibilidad/horario", obtenerHorasDisponibles);

// Actualizar cita completa o estado
router.put(
	"/:id",
	verifyToken,
	authorizeAnyPermission('citas', 'editar citas', 'gestión de citas'),
	validate(schema.updateCitaSchema),
	actualizar
);

// Obtener cita por ID
router.get("/:id", verifyToken, authorizeAnyPermission('citas', 'ver citas', 'ver citas propias'), obtenerPorId);

// Eliminar cita
router.delete(
	"/:id",
	verifyToken,
	authorizeAnyPermission('citas', 'eliminar citas', 'gestión de citas'),
	eliminar
);

export default router;