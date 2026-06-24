"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagosRealizadosService = exports.PagosRealizadosService = void 0;
const pagos_realizados_repository_1 = require("./pagos_realizados.repository");
const pagos_realizados_schema_1 = require("./pagos_realizados.schema");
class PagosRealizadosService {
    async getAllPagos(estado_pago) {
        try {
            const pagos = await pagos_realizados_repository_1.pagosRealizadosRepository.getAllPagos(estado_pago);
            return pagos;
        }
        catch (error) {
            throw new Error(`Error al obtener pagos realizados: ${error}`);
        }
    }
    async getPagoById(id_pago) {
        try {
            const pago = await pagos_realizados_repository_1.pagosRealizadosRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            return pago;
        }
        catch (error) {
            throw new Error(`Error al obtener pago: ${error}`);
        }
    }
    async createPago(data) {
        try {
            const validatedData = pagos_realizados_schema_1.createPagoSchema.parse(data);
            // Obtener información de la compra
            const compraInfo = await pagos_realizados_repository_1.pagosRealizadosRepository.getCompraInfo(validatedData.id_compra);
            if (!compraInfo) {
                throw new Error("Compra no encontrada");
            }
            // Validación especial para consignación: requiere fecha_pago
            const estadoCompra = compraInfo.estado_pago;
            if (estadoCompra === "consignacion" && !validatedData.fecha_pago) {
                throw new Error("Los pagos de consignación requieren una fecha_pago específica");
            }
            // Validar que el monto pagado no supere el pendiente
            const montoPendiente = compraInfo.monto_total - compraInfo.monto_pagado;
            if (validatedData.monto_pagado > montoPendiente) {
                throw new Error(`Monto pagado no puede superar el monto pendiente: ${montoPendiente}`);
            }
            const result = await pagos_realizados_repository_1.pagosRealizadosRepository.createPago(validatedData.id_compra, validatedData.monto_pagado, validatedData.fecha_pago || null, validatedData.metodo_pago, validatedData.referencia);
            return result;
        }
        catch (error) {
            throw new Error(`Error al crear pago: ${error}`);
        }
    }
    async createPagoConsignacion(data) {
        try {
            const validatedData = pagos_realizados_schema_1.createPagoConsignacionSchema.parse(data);
            // Obtener información de la compra
            const compraInfo = await pagos_realizados_repository_1.pagosRealizadosRepository.getCompraInfo(validatedData.id_compra);
            if (!compraInfo) {
                throw new Error("Compra no encontrada");
            }
            // Validar que sea consignación (si hay dato de estado disponible)
            if (compraInfo.estado_pago !== undefined && compraInfo.estado_pago !== "consignacion") {
                throw new Error("Esta compra no es de tipo consignación");
            }
            // Validar monto
            const montoPendiente = compraInfo.monto_total - compraInfo.monto_pagado;
            if (validatedData.monto_pagado > montoPendiente) {
                throw new Error(`Monto pagado no puede superar el monto pendiente: ${montoPendiente}`);
            }
            const result = await pagos_realizados_repository_1.pagosRealizadosRepository.createPago(validatedData.id_compra, validatedData.monto_pagado, validatedData.fecha_pago, validatedData.metodo_pago, validatedData.referencia);
            return result;
        }
        catch (error) {
            throw new Error(`Error al crear pago de consignación: ${error}`);
        }
    }
    async updatePago(id_pago, data) {
        try {
            const validatedData = pagos_realizados_schema_1.updatePagoSchema.parse(data);
            const pago = await pagos_realizados_repository_1.pagosRealizadosRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            const result = await pagos_realizados_repository_1.pagosRealizadosRepository.updatePago(id_pago, validatedData);
            return result;
        }
        catch (error) {
            throw new Error(`Error al actualizar pago: ${error}`);
        }
    }
    async deletePago(id_pago) {
        try {
            const pago = await pagos_realizados_repository_1.pagosRealizadosRepository.getPagoById(id_pago);
            if (!pago) {
                throw new Error("Pago no encontrado");
            }
            const result = await pagos_realizados_repository_1.pagosRealizadosRepository.deletePago(id_pago);
            return result;
        }
        catch (error) {
            throw new Error(`Error al eliminar pago: ${error}`);
        }
    }
}
exports.PagosRealizadosService = PagosRealizadosService;
exports.pagosRealizadosService = new PagosRealizadosService();
