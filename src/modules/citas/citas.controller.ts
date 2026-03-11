import { Request, Response } from "express";
import * as service from "./citas.service";

export const crear = async (req: Request, res: Response) => {
  try {
    const result = await service.crearCita(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const listar = async (_req: Request, res: Response) => {
  try {
    const data = await service.listarCitas();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const actualizarEstado = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    const { estado } = req.body;
    const result = await service.cambiarEstado(id, estado);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = Number(rawId);
    const data = await service.obtenerCitaConVenta(id);
    res.json(data);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};