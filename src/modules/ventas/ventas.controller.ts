import { Request, Response } from "express";
import * as service from "./ventas.service";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const ventas = await service.getVentas();
    console.log('obtenerTodos ventas result:', ventas);
    res.json({ success: true, data: ventas });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    const venta = await service.getVentaById(id);
    console.log('obtenerPorId venta result:', venta);
    if (!venta) return res.status(404).json({ success: false, message: "Venta no encontrada" });
    res.json({ success: true, data: venta });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const result = await service.crearVenta(req.body);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    console.log('actualizar req.body:', req.body);
    const result = await service.updateVenta(id, req.body);
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
    const result = await service.deleteVenta(id);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};