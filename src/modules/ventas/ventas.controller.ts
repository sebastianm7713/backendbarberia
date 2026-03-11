import { Request, Response } from "express";
import * as service from "./ventas.service";

export const crear = async (req: Request, res: Response) => {
  try {
    const result = await service.crearVenta(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const listar = async (_req: Request, res: Response) => {
  try {
    const data = await service.getVentas();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    const data = await service.getVentaById(id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};