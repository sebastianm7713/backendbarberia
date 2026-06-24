"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagosVentasController = exports.PagosVentasController = void 0;
const pagos_ventas_service_1 = require("./pagos_ventas.service");
class PagosVentasController {
    async getAllPagos(req, res) {
        try {
            const { id_venta } = req.query;
            const pagos = await pagos_ventas_service_1.pagosVentasService.getAllPagos(id_venta ? Number(id_venta) : undefined);
            res.status(200).json({ success: true, data: pagos });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getPagoById(req, res) {
        try {
            const { id } = req.params;
            const pago = await pagos_ventas_service_1.pagosVentasService.getPagoById(Number(id));
            res.status(200).json({ success: true, data: pago });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createPago(req, res) {
        try {
            const result = await pagos_ventas_service_1.pagosVentasService.createPago(req.body);
            res.status(201).json({ success: true, message: "Pago de venta creado exitosamente", id_pago: result.id_pago });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updatePago(req, res) {
        try {
            const { id } = req.params;
            const result = await pagos_ventas_service_1.pagosVentasService.updatePago(Number(id), req.body);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deletePago(req, res) {
        try {
            const { id } = req.params;
            await pagos_ventas_service_1.pagosVentasService.deletePago(Number(id));
            res.status(200).json({ success: true, message: "Pago de venta eliminado exitosamente" });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.PagosVentasController = PagosVentasController;
exports.pagosVentasController = new PagosVentasController();
