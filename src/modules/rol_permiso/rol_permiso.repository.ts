import { pool } from '../../config/database';
import { CreateRolPermiso } from './rol_permiso.schema';

export const rolPermisoRepository = {
  async getAll() {
    try {
      const result = await pool
        .request()
        .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            r.nombre AS nombre_rol,
            p.nombre AS nombre_permiso,
            p.descripcion
          FROM Rol_Permiso rp
          INNER JOIN Roles r ON rp.id_rol = r.id_rol
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          ORDER BY rp.id_rol, rp.id_permiso
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener permisos de roles: ${error}`);
    }
  },

  async getByRolId(rolId: number) {
    try {
      const result = await pool
        .request()
        .input('rolId', rolId)
        .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            p.nombre,
            p.descripcion
          FROM Rol_Permiso rp
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_rol = @rolId
          ORDER BY p.nombre
        `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error al obtener permisos del rol: ${error}`);
    }
  },

  async getById(id_rol: number, id_permiso: number) {
    try {
      const result = await pool
        .request()
        .input('id_rol', id_rol)
        .input('id_permiso', id_permiso)
        .query(`
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            p.nombre,
            p.descripcion
          FROM Rol_Permiso rp
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_rol = @id_rol AND rp.id_permiso = @id_permiso
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Error al obtener permiso: ${error}`);
    }
  },

  async create(data: CreateRolPermiso) {
    try {
      console.log('Repository create called with:', data);

      // Verificar que el rol existe
      const rolExists = await pool
        .request()
        .input('id_rol', data.id_rol)
        .query('SELECT 1 FROM Roles WHERE id_rol = @id_rol');

      if (rolExists.recordset.length === 0) {
        throw new Error(`El rol con id ${data.id_rol} no existe`);
      }

      // Verificar que el permiso existe
      const permisoExists = await pool
        .request()
        .input('id_permiso', data.id_permiso)
        .query('SELECT 1 FROM Permisos WHERE id_permiso = @id_permiso');

      if (permisoExists.recordset.length === 0) {
        throw new Error(`El permiso con id ${data.id_permiso} no existe`);
      }

      // Verificar que NO esté ya asignado
      const exists = await pool
        .request()
        .input('id_rol', data.id_rol)
        .input('id_permiso', data.id_permiso)
        .query(`
          SELECT 1 FROM Rol_Permiso 
          WHERE id_rol = @id_rol AND id_permiso = @id_permiso
        `);

      if (exists.recordset.length > 0) {
        throw new Error('Este permiso ya está asignado al rol');
      }

      const result = await pool
        .request()
        .input('id_rol', data.id_rol)
        .input('id_permiso', data.id_permiso)
        .query(`
          INSERT INTO Rol_Permiso (id_rol, id_permiso)
          VALUES (@id_rol, @id_permiso);
          
          SELECT 
            rp.id_rol,
            rp.id_permiso,
            p.nombre,
            p.descripcion
          FROM Rol_Permiso rp
          INNER JOIN Permisos p ON rp.id_permiso = p.id_permiso
          WHERE rp.id_rol = @id_rol AND rp.id_permiso = @id_permiso
        `);

      console.log('Insert result:', result.recordset[0]);
      return result.recordset[0];
    } catch (error: any) {
      console.error('Repository create error:', error.message);
      throw new Error(`Error al crear permiso de rol: ${error.message}`);
    }
  },

  async delete(id_rol: number, id_permiso: number) {
    try {
      console.log('Repository delete called with:', { id_rol, id_permiso });

      const result = await pool
        .request()
        .input('id_rol', id_rol)
        .input('id_permiso', id_permiso)
        .query('DELETE FROM Rol_Permiso WHERE id_rol = @id_rol AND id_permiso = @id_permiso');

      if (result.rowsAffected[0] === 0) {
        throw new Error('No existe esa asignación de permiso al rol');
      }

      return true;
    } catch (error: any) {
      console.error('Repository delete error:', error.message);
      throw new Error(`Error al eliminar permiso de rol: ${error.message}`);
    }
  },

  async deleteByRolId(id_rol: number) {
    const query = 'DELETE FROM Rol_Permiso WHERE id_rol = @id_rol';
    const result = await pool.request().input('id_rol', id_rol).query(query);
    return result;
  },
};
