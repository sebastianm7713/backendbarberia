"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaProductoService = void 0;
const detalle_venta_producto_repository_1 = require("./detalle_venta_producto.repository");
const utils_1 = require("../../shared/utils");
exports.detalleVentaProductoService = {
    async getAll() {
        try {
            return await detalle_venta_producto_repository_1.detalleVentaProductoRepository.getAll();
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener detalles de venta', 500);
        }
    },
    async getById(id_detalle) {
        try {
            const detalle = await detalle_venta_producto_repository_1.detalleVentaProductoRepository.getById(id_detalle);
            if (!detalle) {
                throw new utils_1.AppError('Detalle de venta no encontrado', 404);
            }
            return detalle;
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al obtener detalle de venta', 500);
        }
    },
    async getByVentaId(id_venta) {
        try {
            return await detalle_venta_producto_repository_1.detalleVentaProductoRepository.getByVentaId(id_venta);
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener detalles de venta', 500);
        }
    },
    async create(data) {
        try {
            return await detalle_venta_producto_repository_1.detalleVentaProductoRepository.create(data);
        }
        catch (error) {
            throw new utils_1.AppError('Error al crear detalle de venta', 500);
        }
    },
    async update(id_detalle, data) {
        try {
            const updated = await detalle_venta_producto_repository_1.detalleVentaProductoRepository.update(id_detalle, data);
            if (!updated) {
                throw new utils_1.AppError('Detalle de venta no encontrado', 404);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al actualizar detalle de venta', 500);
        }
    },
    async delete(id_detalle) {
        try {
            const exists = await detalle_venta_producto_repository_1.detalleVentaProductoRepository.getById(id_detalle);
            if (!exists) {
                throw new utils_1.AppError('Detalle de venta no encontrado', 404);
            }
            await detalle_venta_producto_repository_1.detalleVentaProductoRepository.delete(id_detalle);
            return { message: 'Detalle de venta eliminado exitosamente' };
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al eliminar detalle de venta', 500);
        }
    },
};
