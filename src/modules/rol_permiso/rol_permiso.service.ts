import { rolPermisoRepository } from './rol_permiso.repository';
import { CreateRolPermiso } from './rol_permiso.schema';
import { AppError } from '../../shared/utils';

export const rolPermisoService = {
  async getAll() {
    try {
      return await rolPermisoRepository.getAll();
    } catch (error) {
      throw new AppError('Error al obtener permisos de roles', 500);
    }
  },

  async getByRolId(rolId: number) {
    try {
      return await rolPermisoRepository.getByRolId(rolId);
    } catch (error) {
      throw new AppError('Error al obtener permisos del rol', 500);
    }
  },

  async create(data: CreateRolPermiso) {
    try {
      console.log('Service create called with:', data);
      return await rolPermisoRepository.create(data);
    } catch (error: any) {
      console.error('Service create error:', error.message);
      throw new AppError(error.message || 'Error al crear permiso de rol', 500);
    }
  },

  async delete(id_rol: number, id_permiso: number) {
    try {
      await rolPermisoRepository.delete(id_rol, id_permiso);
      return { message: 'Permiso de rol eliminado exitosamente' };
    } catch (error: any) {
      throw new AppError(error.message || 'Error al eliminar permiso de rol', 500);
    }
  },

  async deleteByRolId(rolId: number) {
    try {
      console.log('Service deleteByRolId called with:', rolId);
      const result = await rolPermisoRepository.deleteByRolId(rolId);
      console.log(`Deleted ${result.rowsAffected[0]} permission records for role ${rolId}`);
      return { message: 'Permisos del rol eliminados exitosamente' };
    } catch (error: any) {
      console.error('Service deleteByRolId error:', error.message);
      throw new AppError(error.message || 'Error al eliminar permisos del rol', 500);
    }
  },
};
