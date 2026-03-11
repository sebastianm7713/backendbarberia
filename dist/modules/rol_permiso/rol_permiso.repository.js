"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolPermisoRepository = void 0;
const database_1 = require("../../config/database");
exports.rolPermisoRepository = {
    async getAll() {
        try {
            const result = await database_1.pool
                .request()
                .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            r.nombre as nombre_rol,
            r.descripcion as descripcion_rol,
            p.nombre as nombre_permiso,
            p.descripcion as descripcion_permiso
          FROM Rol_Permiso rp
          INNER JOIN Roles r ON rp.id_rol = r.id_rol
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          ORDER BY rp.id_rol, rp.id_permiso
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener permisos de roles: ${error}`);
        }
    },
    async getByRolId(id_rol) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_rol', id_rol)
                .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            r.nombre as nombre_rol,
            r.descripcion as descripcion_rol,
            p.nombre as nombre_permiso,
            p.descripcion as descripcion_permiso
          FROM Rol_Permiso rp
          INNER JOIN Roles r ON rp.id_rol = r.id_rol
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_rol = @id_rol
          ORDER BY rp.id_permiso
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener permisos del rol: ${error}`);
        }
    },
    async getByPermisoId(id_permiso) {
        try {
            const result = await database_1.pool
                .request()
                .input('id_permiso', id_permiso)
                .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            r.nombre as nombre_rol,
            r.descripcion as descripcion_rol,
            p.nombre as nombre_permiso,
            p.descripcion as descripcion_permiso
          FROM Rol_Permiso rp
          INNER JOIN Roles r ON rp.id_rol = r.id_rol
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_permiso = @id_permiso
          ORDER BY rp.id_rol
        `);
            return result.recordset;
        }
        catch (error) {
            throw new Error(`Error al obtener roles con permiso: ${error}`);
        }
    },
    async create(data) {
        try {
            // Verificar si ya existe la asociación
            const exists = await database_1.pool
                .request()
                .input('id_rol', data.id_rol)
                .input('id_permiso', data.id_permiso)
                .query(`
          SELECT * FROM Rol_Permiso 
          WHERE id_rol = @id_rol AND id_permiso = @id_permiso
        `);
            if (exists.recordset.length > 0) {
                throw new Error('Esta asociación rol-permiso ya existe');
            }
            await database_1.pool
                .request()
                .input('id_rol', data.id_rol)
                .input('id_permiso', data.id_permiso)
                .query(`
          INSERT INTO Rol_Permiso (id_rol, id_permiso)
          VALUES (@id_rol, @id_permiso)
        `);
            return data;
        }
        catch (error) {
            throw new Error(`Error al crear asociación rol-permiso: ${error}`);
        }
    },
    async delete(id_rol, id_permiso) {
        try {
            await database_1.pool
                .request()
                .input('id_rol', id_rol)
                .input('id_permiso', id_permiso)
                .query(`
          DELETE FROM Rol_Permiso 
          WHERE id_rol = @id_rol AND id_permiso = @id_permiso
        `);
            return true;
        }
        catch (error) {
            throw new Error(`Error al eliminar asociación rol-permiso: ${error}`);
        }
    },
    async deleteByRolId(id_rol) {
        try {
            await database_1.pool
                .request()
                .input('id_rol', id_rol)
                .query('DELETE FROM Rol_Permiso WHERE id_rol = @id_rol');
            return true;
        }
        catch (error) {
            throw new Error(`Error al eliminar permisos del rol: ${error}`);
        }
    },
    async deleteByPermisoId(id_permiso) {
        try {
            await database_1.pool
                .request()
                .input('id_permiso', id_permiso)
                .query('DELETE FROM Rol_Permiso WHERE id_permiso = @id_permiso');
            return true;
        }
        catch (error) {
            throw new Error(`Error al eliminar asociaciones del permiso: ${error}`);
        }
    },
};
