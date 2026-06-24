"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pagos_realizados_controller_1 = require("./pagos_realizados.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const permission_middleware_1 = require("../../middleware/permission.middleware");
const router = express_1.default.Router();
// GET All Pagos (ADMIN_TOTAL, ENCARGADO_ALMACEN)
// Query: ?estado_pago=pagado|consignacion|pendiente
router.get("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.getAllPagos(req, res));
// GET Pago by ID (ADMIN_TOTAL, ENCARGADO_ALMACEN)
router.get("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.getPagoById(req, res));
// GET Debug Pagos (desarrollador)
router.get("/debug", (req, res) => pagos_realizados_controller_1.pagosRealizadosController.getAllPagosDebug(req, res));
// POST Create Pago (ADMIN_TOTAL)
router.post("/", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.createPago(req, res));
// POST Create Pago Consignación Mensual (ADMIN_TOTAL)
router.post("/consignacion/registrar", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.createPagoConsignacion(req, res));
// PUT Update Pago (ADMIN_TOTAL)
router.put("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.updatePago(req, res));
// DELETE Pago (ADMIN_TOTAL)
router.delete("/:id", auth_middleware_1.verifyToken, (0, permission_middleware_1.authorizeByModule)('Pagos'), (req, res) => pagos_realizados_controller_1.pagosRealizadosController.deletePago(req, res));
exports.default = router;
