import { Request, Response } from 'express';
import { configuracionLandingService } from './configuracion_landing.service';
import { CreateConfiguracionLanding, ConfiguracionLanding } from './configuracion_landing.schema';

export const configuracionLandingController = {
  async getDefault(req: Request, res: Response) {
    try {
      const config = await configuracionLandingService.getDefault();
      res.json(config);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const data: CreateConfiguracionLanding = req.body;
      const config = await configuracionLandingService.create(data);
      res.status(201).json(config);
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      const data = req.body;
      console.log('Controller update called with:', { id, data });
      const config = await configuracionLandingService.update(id, data);
      res.json(config);
    } catch (error: any) {
      console.error('Controller update error:', error);
      res.status(error.status || 500).json({ 
        success: false,
        message: error.message || 'Error al actualizar configuración',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
      }
      await configuracionLandingService.delete(id);
      res.json({ message: 'Configuración eliminada correctamente' });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message });
    }
  },
};