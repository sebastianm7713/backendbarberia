import { Request, Response } from "express";
import * as service from "./barberos.service";
import { z } from "zod";
import { createBarberoSchema, updateBarberoSchema, barberoIdSchema } from "./barberos.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const barberos = await service.getAllBarberos();
    res.json(barberos);
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
    const { id: validatedId } = barberoIdSchema.parse({ id });
    const barbero = await service.getBarberoById(validatedId);
    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }
    res.json(barbero);
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
    const validatedData = createBarberoSchema.parse(req.body);
    const result = await service.createBarbero(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }
    const { id: validatedId } = barberoIdSchema.parse({ id });
    const validatedData = updateBarberoSchema.parse(req.body);
    const result = await service.updateBarbero(validatedId, validatedData);
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
    const { id: validatedId } = barberoIdSchema.parse({ id });
    const result = await service.deleteBarbero(validatedId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};