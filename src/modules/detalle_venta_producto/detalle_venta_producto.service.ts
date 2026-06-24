import { detalleVentaProductoRepository } from './detalle_venta_producto.repository';
import { CreateDetalleVentaProducto } from './detalle_venta_producto.schema';
import { AppError } from '../../shared/utils';

export const detalleVentaProductoService = {
  async getAll() {
    try {
      return await detalleVentaProductoRepository.getAll();
    } catch (error) {
      throw new AppError('Error al obtener detalles de venta', 500);
    }
  },

  async getById(id_detalle: number) {
    try {
      const detalle = await detalleVentaProductoRepository.getById(id_detalle);
      if (!detalle) {
        throw new AppError('Detalle de venta no encontrado', 404);
      }
      return detalle;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener detalle de venta', 500);
    }
  },

  async getByVentaId(id_venta: number) {
    try {
      return await detalleVentaProductoRepository.getByVentaId(id_venta);
    } catch (error) {
      throw new AppError('Error al obtener detalles de venta', 500);
    }
  },

  async create(data: CreateDetalleVentaProducto) {
    try {
      return await detalleVentaProductoRepository.create(data);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Error al crear detalle de venta: ${error?.message || 'Error desconocido'}`, 500);
    }
  },

  async update(id_detalle: number, data: Partial<CreateDetalleVentaProducto>) {
    try {
      const updated = await detalleVentaProductoRepository.update(id_detalle, data);
      if (!updated) {
        throw new AppError('Detalle de venta no encontrado', 404);
      }
      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al actualizar detalle de venta', 500);
    }
  },

  async delete(id_detalle: number) {
    try {
      const exists = await detalleVentaProductoRepository.getById(id_detalle);
      if (!exists) {
        throw new AppError('Detalle de venta no encontrado', 404);
      }
      await detalleVentaProductoRepository.delete(id_detalle);
      return { message: 'Detalle de venta eliminado exitosamente' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al eliminar detalle de venta', 500);
    }
  },
};
