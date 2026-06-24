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
    async create(req, res, next) {
        try {
            console.log('Create rol permiso req.body:', req.body);
            const validationResult = rol_permiso_schema_1.createRolPermisoSchema.safeParse(req.body);
            if (!validationResult.success) {
                console.log('Validation errors:', validationResult.error.issues);
                return res.status(400).json({
                    success: false,
                    message: 'Datos inválidos',
                    errors: validationResult.error.issues,
                });
            }
            const asignacion = await rol_permiso_service_1.rolPermisoService.create(validationResult.data);
            console.log('Create result:', asignacion);
            res.status(201).json({
                success: true,
                message: 'Permiso asignado al rol exitosamente',
                data: asignacion,
            });
        }
        catch (error) {
            console.error('Error in create rol_permiso:', error.message);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al crear permiso de rol',
            });
        }
    },
    async delete(req, res, next) {
        try {
            console.log('Controller delete called with params:', req.params);
            const rawRolId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
            const rawPermisoId = Array.isArray(req.params.id_permiso) ? req.params.id_permiso[0] : req.params.id_permiso;
            console.log('Raw params:', { rawRolId, rawPermisoId });
            const id_rol = parseInt(rawRolId);
            const id_permiso = parseInt(rawPermisoId);
            console.log('Parsed params:', { id_rol, id_permiso });
            if (isNaN(id_rol) || isNaN(id_permiso)) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetros inválidos: id_rol e id_permiso deben ser números',
                });
            }
            console.log('Delete rol_permiso:', { id_rol, id_permiso });
            await rol_permiso_service_1.rolPermisoService.delete(id_rol, id_permiso);
            res.json({
                success: true,
                message: 'Permiso removido del rol exitosamente',
            });
        }
        catch (error) {
            console.error('Error in delete rol_permiso:', error.message);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al eliminar permiso de rol',
            });
        }
    },
    async deleteByRolId(req, res, next) {
        try {
            console.log('Controller deleteByRolId called with params:', req.params);
            const rawId = Array.isArray(req.params.id_rol) ? req.params.id_rol[0] : req.params.id_rol;
            const id_rol = parseInt(rawId);
            console.log('Delete by rol id:', id_rol);
            if (isNaN(id_rol)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de rol inválido',
                });
            }
            await rol_permiso_service_1.rolPermisoService.deleteByRolId(id_rol);
            console.log('Controller deleteByRolId completed successfully');
            res.json({
                success: true,
                message: 'Todos los permisos del rol eliminados exitosamente',
            });
        }
        catch (error) {
            console.error('Error in deleteByRolId controller:', error.message);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al eliminar permisos del rol',
            });
        }
    },
};
