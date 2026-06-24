import { pagosVentasRepository } from "./pagos_ventas.repository";
import { createPagoVentaSchema, updatePagoVentaSchema } from "./pagos_ventas.schema";

export class PagosVentasService {
  async getAllPagos(id_venta?: number) {
    try {
      return await pagosVentasRepository.getAllPagos(id_venta);
    } catch (error) {
      throw new Error(`Error al obtener pagos de ventas: ${error}`);
    }
  }

  async getPagoById(id_pago: number) {
    try {
      const pago = await pagosVentasRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }
      return pago;
    } catch (error) {
      throw new Error(`Error al obtener pago de venta: ${error}`);
    }
  }

  async createPago(data: any) {
    try {
      const validatedData = createPagoVentaSchema.parse(data);
      const ventaInfo = await pagosVentasRepository.getVentaInfo(validatedData.id_venta);

      if (!ventaInfo) {
        throw new Error("Venta no encontrada");
      }

      const montoPendiente = ventaInfo.monto_total - ventaInfo.monto_pagado;
      if (validatedData.monto_pagado > montoPendiente) {
        throw new Error(`Monto pagado no puede superar el monto pendiente: ${montoPendiente}`);
      }

      const result = await pagosVentasRepository.createPago(
        validatedData.id_venta,
        validatedData.monto_pagado,
        validatedData.fecha_pago || null,
        validatedData.metodo_pago,
        validatedData.referencia
      );

      return result;
    } catch (error) {
      throw new Error(`Error al crear pago de venta: ${error}`);
    }
  }

  async updatePago(id_pago: number, data: any) {
    try {
      const validatedData = updatePagoVentaSchema.parse(data);
      const pago = await pagosVentasRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }
      const result = await pagosVentasRepository.updatePago(id_pago, validatedData);
      return result;
    } catch (error) {
      throw new Error(`Error al actualizar pago de venta: ${error}`);
    }
  }

  async deletePago(id_pago: number) {
    try {
      const pago = await pagosVentasRepository.getPagoById(id_pago);
      if (!pago) {
        throw new Error("Pago no encontrado");
      }
      return await pagosVentasRepository.deletePago(id_pago);
    } catch (error) {
      throw new Error(`Error al eliminar pago de venta: ${error}`);
    }
  }
}

export const pagosVentasService = new PagosVentasService();