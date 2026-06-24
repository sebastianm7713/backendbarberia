import { configuracionLandingRepository } from './configuracion_landing.repository';
import { CreateConfiguracionLanding, ConfiguracionLanding } from './configuracion_landing.schema';
import { AppError } from '../../shared/utils';

export const configuracionLandingService = {
  async getDefault() {
    try {
      const config = await configuracionLandingRepository.getDefault();
      if (!config) {
        throw new AppError('No se encontró configuración de landing', 404);
      }
      return config;
    } catch (error) {
      throw new AppError('Error al obtener configuración de landing', 500);
    }
  },

  async create(data: CreateConfiguracionLanding) {
    try {
      return await configuracionLandingRepository.create(data);
    } catch (error) {
      throw new AppError('Error al crear configuración de landing', 500);
    }
  },

  async update(id: number, data: any) {
    try {
      console.log('Service update called with:', { id, data });
      const fullData = { id, ...data };
      console.log('Full data to update:', fullData);
      const result = await configuracionLandingRepository.update(fullData);
      console.log('Service update success:', result);
      return result;
    } catch (error: any) {
      console.error('Service update error:', error);
      throw new AppError(error.message || 'Error al actualizar configuración de landing', 500);
    }
  },

  async delete(id: number) {
    try {
      await configuracionLandingRepository.delete(id);
    } catch (error) {
      throw new AppError('Error al eliminar configuración de landing', 500);
    }
  },
};