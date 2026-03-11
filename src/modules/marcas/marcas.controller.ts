import { Request, Response } from "express";
import * as service from "./marcas.service";
import { z } from "zod";
import { createMarcaSchema, updateMarcaSchema, marcaIdSchema } from "./marcas.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const marcas = await service.getAllMarcas();
    res.json(marcas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    const marca = await service.getMarcaById(id);
    if (!marca) return res.status(404).json({ message: "Marca no encontrada" });
    res.json(marca);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createMarcaSchema.parse(req.body);
    const result = await service.createMarca(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateMarcaSchema.parse(req.body);
    const result = await service.updateMarca(id, validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteMarca(id);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};