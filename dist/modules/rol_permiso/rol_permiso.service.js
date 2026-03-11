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
    async getByRolId(id_rol) {
        try {
            const permisos = await rol_permiso_repository_1.rolPermisoRepository.getByRolId(id_rol);
            return permisos;
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener permisos del rol', 500);
        }
    },
    async getByPermisoId(id_permiso) {
        try {
            const roles = await rol_permiso_repository_1.rolPermisoRepository.getByPermisoId(id_permiso);
            return roles;
        }
        catch (error) {
            throw new utils_1.AppError('Error al obtener roles con permiso', 500);
        }
    },
    async create(data) {
        try {
            return await rol_permiso_repository_1.rolPermisoRepository.create(data);
        }
        catch (error) {
            throw new utils_1.AppError('Error al crear asociación rol-permiso', 500);
        }
    },
    async delete(id_rol, id_permiso) {
        try {
            await rol_permiso_repository_1.rolPermisoRepository.delete(id_rol, id_permiso);
            return { message: 'Asociación rol-permiso eliminada exitosamente' };
        }
        catch (error) {
            throw new utils_1.AppError('Error al eliminar asociación rol-permiso', 500);
        }
    },
    async deleteByRolId(id_rol) {
        try {
            await rol_permiso_repository_1.rolPermisoRepository.deleteByRolId(id_rol);
            return { message: 'Permisos del rol eliminados exitosamente' };
        }
        catch (error) {
            throw new utils_1.AppError('Error al eliminar permisos del rol', 500);
        }
    },
    async deleteByPermisoId(id_permiso) {
        try {
            await rol_permiso_repository_1.rolPermisoRepository.deleteByPermisoId(id_permiso);
            return { message: 'Asociaciones del permiso eliminadas exitosamente' };
        }
        catch (error) {
            throw new utils_1.AppError('Error al eliminar asociaciones del permiso', 500);
        }
    },
};
