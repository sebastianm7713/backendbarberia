"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionLandingController = void 0;
const configuracion_landing_service_1 = require("./configuracion_landing.service");
exports.configuracionLandingController = {
    async getDefault(req, res) {
        try {
            const config = await configuracion_landing_service_1.configuracionLandingService.getDefault();
            res.json(config);
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    async create(req, res) {
        try {
            const data = req.body;
            const config = await configuracion_landing_service_1.configuracionLandingService.create(data);
            res.status(201).json(config);
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
    async update(req, res) {
        try {
            const idParam = req.params.id;
            const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            const data = req.body;
            console.log('Controller update called with:', { id, data });
            const config = await configuracion_landing_service_1.configuracionLandingService.update(id, data);
            res.json(config);
        }
        catch (error) {
            console.error('Controller update error:', error);
            res.status(error.status || 500).json({
                success: false,
                message: error.message || 'Error al actualizar configuración',
                error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
            });
        }
    },
    async delete(req, res) {
        try {
            const idParam = req.params.id;
            const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }
            await configuracion_landing_service_1.configuracionLandingService.delete(id);
            res.json({ message: 'Configuración eliminada correctamente' });
        }
        catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    },
};
