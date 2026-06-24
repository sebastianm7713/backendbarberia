"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detalleVentaServicioController = void 0;
const detalle_venta_servicio_service_1 = require("./detalle_venta_servicio.service");
const detalle_venta_servicio_schema_1 = require("./detalle_venta_servicio.schema");
exports.detalleVentaServicioController = {
    async getAll(req, res, next) {
        try {
            const detalles = await detalle_venta_servicio_service_1.detalleVentaServicioService.getAll();
            console.log('getAll result:', detalles);
            res.json({
                success: true,
                data: detalles,
            });
        }
        catch (error) {
            console.error('Error in getAll:', error);
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.getById(id_detalle);
            console.log('getById result:', detalle);
            res.json({
                success: true,
                data: detalle,
            });
        }
        catch (error) {
            console.error('Error in getById:', error);
            next(error);
        }
    },
    async getByVentaId(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id_venta) ? req.params.id_venta[0] : req.params.id_venta;
            const id_venta = parseInt(rawId);
            if (Number.isNaN(id_venta)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de venta inválido',
                });
            }
            const detalles = await detalle_venta_servicio_service_1.detalleVentaServicioService.getByVentaId(id_venta);
            console.log('getByVentaId result:', detalles);
            res.json({
                success: true,
                data: detalles,
            });
        }
        catch (error) {
            console.error('Error in getByVentaId:', error);
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            console.log('create req.body:', req.body);
            const validationResult = detalle_venta_servicio_schema_1.createDetalleVentaServicioSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    message: "Datos inválidos",
                    errors: validationResult.error.issues,
                });
            }
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.create(validationResult.data);
            console.log('create result:', detalle);
            res.status(201).json({
                success: true,
                data: detalle,
            });
        }
        catch (error) {
            console.error('Error in create:', error);
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            console.log('update req.body:', req.body);
            const validationResult = detalle_venta_servicio_schema_1.createDetalleVentaServicioSchema.partial().safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    message: "Datos inválidos",
                    errors: validationResult.error.issues,
                });
            }
            const detalle = await detalle_venta_servicio_service_1.detalleVentaServicioService.update(id_detalle, validationResult.data);
            console.log('update result:', detalle);
            res.json({
                success: true,
                data: detalle,
            });
        }
        catch (error) {
            console.error('Error in update:', error);
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id_detalle = parseInt(rawId);
            await detalle_venta_servicio_service_1.detalleVentaServicioService.delete(id_detalle);
            console.log('delete result: deleted id', id_detalle);
            res.json({
                success: true,
                data: null,
            });
        }
        catch (error) {
            console.error('Error in delete:', error);
            next(error);
        }
    },
};
