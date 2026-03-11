"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolPermisoController = void 0;
const rol_permiso_service_1 = require("./rol_permiso.service");
const rol_permiso_schema_1 = require("./rol_permiso.schema");
exports.rolPermisoController = {
    async getAll(req, res, next) {
        try {
            const asignaciones = await rol_permiso_service_1.rolPermisoService.getAll();
            res.json({
                success: true,
                message: 'Asignaciones rol-permiso obtenidas exitosamente',
                data: asignaciones,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getByRolId(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
            const id_rol = parseInt(rawId);
            const permisos = await rol_permiso_service_1.rolPermisoService.getByRolId(id_rol);
            res.json({
                success: true,
                message: 'Permisos del rol obtenidos exitosamente',
                data: permisos,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getByPermisoId(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;
            const id_permiso = parseInt(rawId);
            const roles = await rol_permiso_service_1.rolPermisoService.getByPermisoId(id_permiso);
            res.json({
                success: true,
                message: 'Roles con permiso obtenidos exitosamente',
                data: roles,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async create(req, res, next) {
        try {
            const validationResult = rol_permiso_schema_1.createRolPermisoSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    errors: validationResult.error.errors,
                });
            }
            const asignacion = await rol_permiso_service_1.rolPermisoService.create(validationResult.data);
            res.status(201).json({
                success: true,
                message: 'Permiso asignado al rol exitosamente',
                data: asignacion,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const rawRolId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
            const rawPermisoId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;
            const id_rol = parseInt(rawRolId);
            const id_permiso = parseInt(rawPermisoId);
            await rol_permiso_service_1.rolPermisoService.delete(id_rol, id_permiso);
            res.json({
                success: true,
                message: 'Permiso removido del rol exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    },
    async deleteByRolId(req, res, next) {
        try {
            const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
            const id_rol = parseInt(rawId);
            await rol_permiso_service_1.rolPermisoService.deleteByRolId(id_rol);
            res.json({
                success: true,
                message: 'Todos los permisos del rol eliminados exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    },
};
