"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pagos_ventas_controller_1 = require("./pagos_ventas.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_ventas_controller_1.pagosVentasController.getAllPagos(req, res));
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_ventas_controller_1.pagosVentasController.getPagoById(req, res));
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_ventas_controller_1.pagosVentasController.createPago(req, res));
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_ventas_controller_1.pagosVentasController.updatePago(req, res));
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_ventas_controller_1.pagosVentasController.deletePago(req, res));
exports.default = router;
