import { Request, Response } from "express";
import * as service from "./categorias_productos.service";
import { z } from "zod";
import { createCategoriaSchema, updateCategoriaSchema, categoriaIdSchema } from "./categorias_productos.schema";

export const obtenerTodos = async (_: Request, res: Response) => {
  try {
    const categorias = await service.getAllCategorias();
    console.log('obtenerTodos categorias result:', categorias);
    res.json({ success: true, data: categorias });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    const categoria = await service.getCategoriaById(validatedId);
    console.log('obtenerPorId categoria result:', categoria);
    if (!categoria) return res.status(404).json({ success: false, message: "Categoria no encontrada" });
    res.json({ success: true, data: categoria });
  } catch (error: any) {
    console.error('Error in obtenerPorId:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    console.log('crear req.body:', req.body);
    const validatedData = createCategoriaSchema.parse(req.body);
    const result = await service.createCategoria(validatedData);
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
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateCategoriaSchema.parse(req.body);
    const result = await service.updateCategoria(validatedId, validatedData);
    console.log('actualizar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in actualizar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    const result = await service.deleteCategoria(validatedId);
    console.log('eliminar result:', result);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in eliminar:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};