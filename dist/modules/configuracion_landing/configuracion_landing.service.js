"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionLandingService = void 0;
const configuracion_landing_repository_1 = require("./configuracion_landing.repository");
const utils_1 = require("../../shared/utils");
exports.configuracionLandingService = {
    async getDefault() {
        try {
            const config = await configuracion_landing_repository_1.configuracionLandingRepository.getDefault();
            if (!config) {
                throw new utils_1.AppError('No se encontró configuración de landing', 404);
            }
            return config;
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener configuración de landing', 500);
        }
    },
    async create(data) {
        try {
            return await configuracion_landing_repository_1.configuracionLandingRepository.create(data);
        }
        catch (error) {
            throw new utils_1.AppError('Error al crear configuración de landing', 500);
        }
    },
    async update(id, data) {
        try {
            console.log('Service update called with:', { id, data });
            const fullData = { id, ...data };
            console.log('Full data to update:', fullData);
            const result = await configuracion_landing_repository_1.configuracionLandingRepository.update(fullData);
            console.log('Service update success:', result);
            return result;
        }
        catch (error) {
            console.error('Service update error:', error);
            throw new utils_1.AppError(error.message || 'Error al actualizar configuración de landing', 500);
        }
    },
    async delete(id) {
        try {
            await configuracion_landing_repository_1.configuracionLandingRepository.delete(id);
        }
        catch (error) {
            throw new utils_1.AppError('Error al eliminar configuración de landing', 500);
        }
    },
};
