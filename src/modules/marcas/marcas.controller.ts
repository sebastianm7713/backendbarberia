import { Request, Response } from "express";
import * as service from "./marcas.service";
import { z } from "zod";
import { createMarcaSchema, updateMarcaSchema, marcaIdSchema } from "./marcas.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const marcas = await service.getAllMarcas();
    console.log('obtenerTodos marcas result:', marcas);
    res.json({ success: true, data: marcas });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    const marca = await service.getMarcaById(id);
    console.log('obtenerPorId marca result:', marca);
    if (!marca) return res.status(404).json({ success: false, message: "Marca no encontrada" });
    res.json({ success: true, data: marca });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const validatedData = createMarcaSchema.parse(req.body);
    const result = await service.createMarca(validatedData);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateMarcaSchema.parse(req.body);
    const result = await service.updateMarca(id, validatedData);
    console.log('actualizar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizar:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = marcaIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteMarca(id);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    res.status(error instanceof z.ZodError ? 400 : 500).json({ success: false, message: error.message });
  }
};