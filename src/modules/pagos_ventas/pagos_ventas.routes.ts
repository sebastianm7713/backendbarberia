import express from "express";
import { pagosVentasController } from "./pagos_ventas.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { authorizeByModule } from "../../middleware/permission.middleware";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosVentasController.getAllPagos(req, res)
);

router.get(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosVentasController.getPagoById(req, res)
);

router.post(
  "/",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosVentasController.createPago(req, res)
);

router.put(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosVentasController.updatePago(req, res)
);

router.delete(
  "/:id",
  verifyToken,
  authorizeByModule('Pagos'),
  (req, res) => pagosVentasController.deletePago(req, res)
);

export default router;
