"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolPermisoService = void 0;
const rol_permiso_repository_1 = require("./rol_permiso.repository");
const utils_1 = require("../../shared/utils");
exports.rolPermisoService = {
    async getAll() {
        try {
            return await rol_permiso_repository_1.rolPermisoRepository.getAll();
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener permisos de roles', 500);
        }
    },
    async getByRolId(rolId) {
        try {
            return await rol_permiso_repository_1.rolPermisoRepository.getByRolId(rolId);
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener permisos del rol', 500);
        }
    },
    async create(data) {
        try {
            console.log('Service create called with:', data);
            return await rol_permiso_repository_1.rolPermisoRepository.create(data);
        }
        catch (error) {
            console.error('Service create error:', error.message);
            throw new utils_1.AppError(error.message || 'Error al crear permiso de rol', 500);
        }
    },
    async delete(id_rol, id_permiso) {
        try {
            await rol_permiso_repository_1.rolPermisoRepository.delete(id_rol, id_permiso);
            return { message: 'Permiso de rol eliminado exitosamente' };
        }
        catch (error) {
            throw new utils_1.AppError(error.message || 'Error al eliminar permiso de rol', 500);
        }
    },
    async deleteByRolId(rolId) {
        try {
            console.log('Service deleteByRolId called with:', rolId);
            const result = await rol_permiso_repository_1.rolPermisoRepository.deleteByRolId(rolId);
            console.log(`Deleted ${result.rowsAffected[0]} permission records for role ${rolId}`);
            return { message: 'Permisos del rol eliminados exitosamente' };
        }
        catch (error) {
            console.error('Service deleteByRolId error:', error.message);
            throw new utils_1.AppError(error.message || 'Error al eliminar permisos del rol', 500);
        }
    },
};
