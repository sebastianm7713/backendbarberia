"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaServicioService = void 0;
const detalle_venta_servicio_repository_1 = require("./detalle_venta_servicio.repository");
const utils_1 = require("../../shared/utils");
exports.detalleVentaServicioService = {
    async getAll() {
        try {
            return await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.getAll();
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener detalles de servicio', 500);
        }
    },
    async getById(id_detalle) {
        try {
            const detalle = await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.getById(id_detalle);
            if (!detalle) {
                throw new utils_1.AppError('Detalle de servicio no encontrado', 404);
            }
            return detalle;
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al obtener detalle de servicio', 500);
        }
    },
    async getByVentaId(id_venta) {
        if (Number.isNaN(id_venta)) {
            throw new utils_1.AppError('ID de venta inválido', 400);
        }
        try {
            return await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.getByVentaId(id_venta);
        }
        catch (error) {
            throw new utils_1.AppError(`Error al obtener detalles de servicio: ${error?.message || error}`, 500);
        }
    },
    async create(data) {
        try {
            return await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.create(data);
        }
        catch (error) {
            throw new utils_1.AppError('Error al crear detalle de servicio', 500);
        }
    },
    async update(id_detalle, data) {
        try {
            const updated = await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.update(id_detalle, data);
            if (!updated) {
                throw new utils_1.AppError('Detalle de servicio no encontrado', 404);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al actualizar detalle de servicio', 500);
        }
    },
    async delete(id_detalle) {
        try {
            const exists = await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.getById(id_detalle);
            if (!exists) {
                throw new utils_1.AppError('Detalle de servicio no encontrado', 404);
            }
            await detalle_venta_servicio_repository_1.detalleVentaServicioRepository.delete(id_detalle);
            return { message: 'Detalle de servicio eliminado exitosamente' };
        }
        catch (error) {
            if (error instanceof utils_1.AppError)
                throw error;
            throw new utils_1.AppError('Error al eliminar detalle de servicio', 500);
        }
    },
};
