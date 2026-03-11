import { Request, Response } from "express";
import * as service from "./categorias_productos.service";
import { z } from "zod";
import { createCategoriaSchema, updateCategoriaSchema, categoriaIdSchema } from "./categorias_productos.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const categorias = await service.getAllCategorias();
    res.json(categorias);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    const categoria = await service.getCategoriaById(validatedId);
    if (!categoria) return res.status(404).json({ message: "Categoria no encontrada" });
    res.json(categoria);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategoriaSchema.parse(req.body);
    const result = await service.createCategoria(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    const validatedData = updateCategoriaSchema.parse(req.body);
    const result = await service.updateCategoria(validatedId, validatedData);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = categoriaIdSchema.parse({ id });
    const result = await service.deleteCategoria(validatedId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};