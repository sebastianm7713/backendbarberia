import { pagosRealizadosRepository } from "./pagos_realizados.repository";
import { createPagoSchema, updatePagoSchema, createPagoConsignacionSchema } from "./pagos_realizados.schema";

export class PagosRealizadosService {
  async getAllPagos(estado_pago?: string) {
    try {
      const pagos = await pagosRealizadosRepository.getAllPagos(estado_pago);
      return pagos;
    } catch (error) {
      throw new Error(`Error al obtener pagos realizados: ${error}`);
    }
  }

  async getPagoById(id_pago: number) {
    try {
      const pago = await pagosRealizadosRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }
      return pago;
    } catch (error) {
      throw new Error(`Error al obtener pago: ${error}`);
    }
  }

  async createPago(data: any) {
    try {
      const validatedData = createPagoSchema.parse(data);

      // Obtener información de la compra
      const compraInfo = await pagosRealizadosRepository.getCompraInfo(validatedData.id_compra);
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

      const result = await pagosRealizadosRepository.createPago(
        validatedData.id_compra,
        validatedData.monto_pagado,
        validatedData.fecha_pago || null,
        validatedData.metodo_pago,
        validatedData.referencia
      );

      return result;
    } catch (error) {
      throw new Error(`Error al crear pago: ${error}`);
    }
  }

  async createPagoConsignacion(data: any) {
    try {
      const validatedData = createPagoConsignacionSchema.parse(data);

      // Obtener información de la compra
      const compraInfo = await pagosRealizadosRepository.getCompraInfo(validatedData.id_compra);
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

      const result = await pagosRealizadosRepository.createPago(
        validatedData.id_compra,
        validatedData.monto_pagado,
        validatedData.fecha_pago,
        validatedData.metodo_pago,
        validatedData.referencia
      );

      return result;
    } catch (error) {
      throw new Error(`Error al crear pago de consignación: ${error}`);
    }
  }

  async updatePago(id_pago: number, data: any) {
    try {
      const validatedData = updatePagoSchema.parse(data);

      const pago = await pagosRealizadosRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }

      const result = await pagosRealizadosRepository.updatePago(id_pago, validatedData);
      return result;
    } catch (error) {
      throw new Error(`Error al actualizar pago: ${error}`);
    }
  }

  async deletePago(id_pago: number) {
    try {
      const pago = await pagosRealizadosRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }

      const result = await pagosRealizadosRepository.deletePago(id_pago);
      return result;
    } catch (error) {
      throw new Error(`Error al eliminar pago: ${error}`);
    }
  }
}

export const pagosRealizadosService = new PagosRealizadosService();
