import { Request, Response } from "express";
import * as service from "./estado_venta.service";

export const listar = async (_: Request, res: Response) => {
  try {
    const estados = await service.listarEstadosVenta();
    res.json({ success: true, data: estados });
  } catch (error: any) {
    console.error('Error in listar estados venta:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const estado = await service.obtenerEstadoVentaPorId(id);
    res.json({ success: true, data: estado });
  } catch (error: any) {
    console.error('Error in obtenerPorId estado venta:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};