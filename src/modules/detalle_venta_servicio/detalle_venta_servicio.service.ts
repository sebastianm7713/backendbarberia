import { detalleVentaServicioRepository } from './detalle_venta_servicio.repository';
import { CreateDetalleVentaServicio } from './detalle_venta_servicio.schema';
import { AppError } from '../../shared/utils';

export const detalleVentaServicioService = {
  async getAll() {
    try {
      return await detalleVentaServicioRepository.getAll();
    } catch (error) {
      throw new AppError('Error al obtener detalles de servicio', 500);
    }
  },

  async getById(id_detalle: number) {
    try {
      const detalle = await detalleVentaServicioRepository.getById(id_detalle);
      if (!detalle) {
        throw new AppError('Detalle de servicio no encontrado', 404);
      }
      return detalle;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener detalle de servicio', 500);
    }
  },

  async getByVentaId(id_venta: number) {
    if (Number.isNaN(id_venta)) {
      throw new AppError('ID de venta inválido', 400);
    }

    try {
      return await detalleVentaServicioRepository.getByVentaId(id_venta);
    } catch (error: any) {
      throw new AppError(`Error al obtener detalles de servicio: ${error?.message || error}`, 500);
    }
  },

  async create(data: CreateDetalleVentaServicio) {
    try {
      return await detalleVentaServicioRepository.create(data);
    } catch (error) {
      throw new AppError('Error al crear detalle de servicio', 500);
    }
  },

  async update(id_detalle: number, data: Partial<CreateDetalleVentaServicio>) {
    try {
      const updated = await detalleVentaServicioRepository.update(id_detalle, data);
      if (!updated) {
        throw new AppError('Detalle de servicio no encontrado', 404);
      }
      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al actualizar detalle de servicio', 500);
    }
  },

  async delete(id_detalle: number) {
    try {
      const exists = await detalleVentaServicioRepository.getById(id_detalle);
      if (!exists) {
        throw new AppError('Detalle de servicio no encontrado', 404);
      }
      await detalleVentaServicioRepository.delete(id_detalle);
      return { message: 'Detalle de servicio eliminado exitosamente' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al eliminar detalle de servicio', 500);
    }
  },
};
