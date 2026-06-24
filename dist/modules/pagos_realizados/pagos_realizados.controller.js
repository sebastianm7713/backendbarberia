"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagosRealizadosController = exports.PagosRealizadosController = void 0;
const pagos_realizados_service_1 = require("./pagos_realizados.service");
class PagosRealizadosController {
    async getAllPagos(req, res) {
        try {
            const { estado_pago } = req.query;
            const pagos = await pagos_realizados_service_1.pagosRealizadosService.getAllPagos(estado_pago);
            res.status(200).json(pagos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAllPagosDebug(req, res) {
        try {
            const { estado_pago } = req.query;
            const pagos = await pagos_realizados_service_1.pagosRealizadosService.getAllPagos(estado_pago);
            res.status(200).json({ success: true, params: { estado_pago }, count: pagos.length, data: pagos });
        }
        catch (error) {
            console.error("DEBUG pagos-realizados error:", error);
            res.status(500).json({ error: error.message });
        }
    }
    async getPagoById(req, res) {
        try {
            const { id } = req.params;
            const pago = await pagos_realizados_service_1.pagosRealizadosService.getPagoById(Number(id));
            res.status(200).json(pago);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async createPago(req, res) {
        try {
            const result = await pagos_realizados_service_1.pagosRealizadosService.createPago(req.body);
            res.status(201).json({
                message: "Pago creado exitosamente",
                id_pago: result.id_pago,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createPagoConsignacion(req, res) {
        try {
            const result = await pagos_realizados_service_1.pagosRealizadosService.createPagoConsignacion(req.body);
            res.status(201).json({
                message: "Pago de consignación registrado exitosamente",
                id_pago: result.id_pago,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async updatePago(req, res) {
        try {
            const { id } = req.params;
            const result = await pagos_realizados_service_1.pagosRealizadosService.updatePago(Number(id), req.body);
            res.status(200).json({
                message: "Pago actualizado exitosamente",
                data: result,
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async deletePago(req, res) {
        try {
            const { id } = req.params;
            await pagos_realizados_service_1.pagosRealizadosService.deletePago(Number(id));
            res.status(200).json({ message: "Pago eliminado exitosamente" });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.PagosRealizadosController = PagosRealizadosController;
exports.pagosRealizadosController = new PagosRealizadosController();
