import { Request, Response } from "express";
import * as service from "./citas.service";

export const listar = async (_: Request, res: Response) => {
  try {
    const citas = await service.listarCitas();
    console.log('listar citas result:', citas);
    res.json({ success: true, data: citas });
  } catch (error: any) {
    console.error('Error in listar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    const cita = await service.obtenerCitaConVenta(id);
    console.log('obtenerPorId cita result:', cita);
    if (!cita) return res.status(404).json({ success: false, message: "Cita no encontrada" });
    res.json({ success: true, data: cita });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const result = await service.crearCita(req.body);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crearDesdeLanding = async (req: Request, res: Response) => {
  try {
    console.log('crearDesdeLanding req.body:', req.body);
    const result = await service.crearCita(req.body);
    console.log('crearDesdeLanding result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crearDesdeLanding:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    console.log('actualizar req.body:', req.body);
    const result = await service.actualizarCita(id, req.body);
    console.log('actualizar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    console.log('eliminar id:', id);
    const result = await service.eliminarCita(id);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerHorasDisponibles = async (req: Request, res: Response) => {
  try {
    const { id_barbero, fecha } = req.query;
    
    if (!id_barbero || !fecha) {
      return res.status(400).json({ success: false, message: "Parámetros id_barbero y fecha son requeridos" });
    }

    const barberoId = Number(id_barbero);
    const fechaStr = String(fecha);

    console.log('obtenerHorasDisponibles:', { barberoId, fechaStr });
    const horas = await service.obtenerHorasDisponibles(barberoId, fechaStr);
    console.log('horas disponibles:', horas);
    
    res.json({ success: true, data: horas });
  } catch (error: any) {
    console.error('Error in obtenerHorasDisponibles:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};