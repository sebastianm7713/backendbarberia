"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaServicioController = void 0;
const detalle_venta_servicio_service_1 = require("./detalle_venta_servicio.service");
const detalle_venta_servicio_schema_1 = require("./detalle_venta_servicio.schema");
exports.detalleVentaServicioController = {
    async getAll(req, res, next) {
        try {
            const detalles = await detalle_venta_servicio_service_1.detalleVentaServicioService.getAll();
            res.json({
                success: true,
                message: 'Detalles de servicio obtenidos exitosamente',
                data: detalles,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.getById(id_detalle);
            res.json({
                success: true,
                message: 'Detalle de servicio obtenido exitosamente',
                data: detalle,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getByVentaId(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id_venta) ? req.params.id_venta[0] : req.params.id_venta;
            const id_venta = parseInt(rawId);
            const detalles = await detalle_venta_servicio_service_1.detalleVentaServicioService.getByVentaId(id_venta);
            res.json({
                success: true,
                message: 'Detalles de servicio obtenidos exitosamente',
                data: detalles,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const validationResult = detalle_venta_servicio_schema_1.createDetalleVentaServicioSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    errors: validationResult.error.errors,
                });
            }
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.create(validationResult.data);
            res.status(201).json({
                success: true,
                message: 'Detalle de servicio creado exitosamente',
                data: detalle,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            const validationResult = detalle_venta_servicio_schema_1.createDetalleVentaServicioSchema.partial().safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    errors: validationResult.error.errors,
                });
            }
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.update(id_detalle, validationResult.data);
            res.json({
                success: true,
                message: 'Detalle de servicio actualizado exitosamente',
                data: detalle,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            await detalle_venta_servicio_service_1.detalleVentaServicioService.delete(id_detalle);
            res.json({
                success: true,
                message: 'Detalle de servicio eliminado exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    },
};
