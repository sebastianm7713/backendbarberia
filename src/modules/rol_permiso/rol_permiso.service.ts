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

  async getByRolId(id_rol: number) {
    try {
      const permisos = await rolPermisoRepository.getByRolId(id_rol);
      return permisos;
    } catch (error) {
      throw new AppError('Error al obtener permisos del rol', 500);
    }
  },

  async getByPermisoId(id_permiso: number) {
    try {
      const roles = await rolPermisoRepository.getByPermisoId(id_permiso);
      return roles;
    } catch (error) {
      throw new AppError('Error al obtener roles con permiso', 500);
    }
  },

  async create(data: CreateRolPermiso) {
    try {
      return await rolPermisoRepository.create(data);
    } catch (error) {
      throw new AppError('Error al crear asociación rol-permiso', 500);
    }
  },

  async delete(id_rol: number, id_permiso: number) {
    try {
      await rolPermisoRepository.delete(id_rol, id_permiso);
      return { message: 'Asociación rol-permiso eliminada exitosamente' };
    } catch (error) {
      throw new AppError('Error al eliminar asociación rol-permiso', 500);
    }
  },

  async deleteByRolId(id_rol: number) {
    try {
      await rolPermisoRepository.deleteByRolId(id_rol);
      return { message: 'Permisos del rol eliminados exitosamente' };
    } catch (error) {
      throw new AppError('Error al eliminar permisos del rol', 500);
    }
  },

  async deleteByPermisoId(id_permiso: number) {
    try {
      await rolPermisoRepository.deleteByPermisoId(id_permiso);
      return { message: 'Asociaciones del permiso eliminadas exitosamente' };
    } catch (error) {
      throw new AppError('Error al eliminar asociaciones del permiso', 500);
    }
  },
};
