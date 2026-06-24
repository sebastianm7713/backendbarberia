"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagosVentasService = exports.PagosVentasService = void 0;
const pagos_ventas_repository_1 = require("./pagos_ventas.repository");
const pagos_ventas_schema_1 = require("./pagos_ventas.schema");
class PagosVentasService {
    async getAllPagos(id_venta) {
        try {
            return await pagos_ventas_repository_1.pagosVentasRepository.getAllPagos(id_venta);
        }
        catch (error) {
            throw new Error(`Error al obtener pagos de ventas: ${error}`);
        }
    }
    async getPagoById(id_pago) {
        try {
            const pago = await pagos_ventas_repository_1.pagosVentasRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            return pago;
        }
        catch (error) {
            throw new Error(`Error al obtener pago de venta: ${error}`);
        }
    }
    async createPago(data) {
        try {
            const validatedData = pagos_ventas_schema_1.createPagoVentaSchema.parse(data);
            const ventaInfo = await pagos_ventas_repository_1.pagosVentasRepository.getVentaInfo(validatedData.id_venta);
            if (!ventaInfo) {
                throw new Error("Venta no encontrada");
            }
            const montoPendiente = ventaInfo.monto_total - ventaInfo.monto_pagado;
            if (validatedData.monto_pagado > montoPendiente) {
                throw new Error(`Monto pagado no puede superar el monto pendiente: ${montoPendiente}`);
            }
            const result = await pagos_ventas_repository_1.pagosVentasRepository.createPago(validatedData.id_venta, validatedData.monto_pagado, validatedData.fecha_pago || null, validatedData.metodo_pago, validatedData.referencia);
            return result;
        }
        catch (error) {
            throw new Error(`Error al crear pago de venta: ${error}`);
        }
    }
    async updatePago(id_pago, data) {
        try {
            const validatedData = pagos_ventas_schema_1.updatePagoVentaSchema.parse(data);
            const pago = await pagos_ventas_repository_1.pagosVentasRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            const result = await pagos_ventas_repository_1.pagosVentasRepository.updatePago(id_pago, validatedData);
            return result;
        }
        catch (error) {
            throw new Error(`Error al actualizar pago de venta: ${error}`);
        }
    }
    async deletePago(id_pago) {
        try {
            const pago = await pagos_ventas_repository_1.pagosVentasRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            return await pagos_ventas_repository_1.pagosVentasRepository.deletePago(id_pago);
        }
        catch (error) {
            throw new Error(`Error al eliminar pago de venta: ${error}`);
        }
    }
}
exports.PagosVentasService = PagosVentasService;
exports.pagosVentasService = new PagosVentasService();
