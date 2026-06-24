import express from "express";
import { pagosRealizadosController } from "./pagos_realizados.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = express.Router();

// GET All Pagos (ADMIN_TOTAL, ENCARGADO_ALMACEN)
// Query: ?estado_pago=pagado|consignacion|pendiente
router.get(
  "/",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.getAllPagos(req, res)
);

// GET Pago by ID (ADMIN_TOTAL, ENCARGADO_ALMACEN)
router.get(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.getPagoById(req, res)
);

// GET Debug Pagos (desarrollador)
router.get(
  "/debug",
  (req, res) => pagosRealizadosController.getAllPagosDebug(req, res)
);

// POST Create Pago (ADMIN_TOTAL)
router.post(
  "/",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.createPago(req, res)
);

// POST Create Pago Consignación Mensual (ADMIN_TOTAL)
router.post(
  "/consignacion/registrar",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.createPagoConsignacion(req, res)
);

// PUT Update Pago (ADMIN_TOTAL)
router.put(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.updatePago(req, res)
);

// DELETE Pago (ADMIN_TOTAL)
router.delete(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosRealizadosController.deletePago(req, res)
);

export default router;
