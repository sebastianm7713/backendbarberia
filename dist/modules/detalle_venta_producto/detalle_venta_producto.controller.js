"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaProductoController = void 0;
const detalle_venta_producto_service_1 = require("./detalle_venta_producto.service");
const detalle_venta_producto_schema_1 = require("./detalle_venta_producto.schema");
exports.detalleVentaProductoController = {
    async getAll(req, res, next) {
        try {
            const detalles = await detalle_venta_producto_service_1.detalleVentaProductoService.getAll();
            res.json({
                success: true,
                message: 'Detalles de venta obtenidos exitosamente',
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
            const detalle = await detalle_venta_producto_service_1.detalleVentaProductoService.getById(id_detalle);
            res.json({
                success: true,
                message: 'Detalle de venta obtenido exitosamente',
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
            const detalles = await detalle_venta_producto_service_1.detalleVentaProductoService.getByVentaId(id_venta);
            res.json({
                success: true,
                message: 'Detalles de venta obtenidos exitosamente',
                data: detalles,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const validationResult = detalle_venta_producto_schema_1.createDetalleVentaProductoSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    errors: validationResult.error.errors,
                });
            }
            const detalle = await detalle_venta_producto_service_1.detalleVentaProductoService.create(validationResult.data);
            res.status(201).json({
                success: true,
                message: 'Detalle de venta creado exitosamente',
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
            const validationResult = detalle_venta_producto_schema_1.createDetalleVentaProductoSchema.partial().safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    errors: validationResult.error.errors,
                });
            }
            const detalle = await detalle_venta_producto_service_1.detalleVentaProductoService.update(id_detalle, validationResult.data);
            res.json({
                success: true,
                message: 'Detalle de venta actualizado exitosamente',
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
            await detalle_venta_producto_service_1.detalleVentaProductoService.delete(id_detalle);
            res.json({
                success: true,
                message: 'Detalle de venta eliminado exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    },
};
