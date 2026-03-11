import { Request, Response } from "express";
import * as service from "./tipo_documento.service";
import { z } from "zod";
import { createTipoDocumentoSchema, updateTipoDocumentoSchema, tipoDocumentoIdSchema } from "./tipo_documento.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const tipos = await service.getAllTiposDocumento();
    res.json(tipos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    const tipo = await service.getTipoDocumentoById(id);
    if (!tipo) return res.status(404).json({ message: "Tipo de documento no encontrado" });
    res.json(tipo);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const crear = async (req: Request, res: Response) => {
  try {
    const validatedData = createTipoDocumentoSchema.parse(req.body);
    const result = await service.createTipoDocumento(validatedData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    const validatedData = updateTipoDocumentoSchema.parse(req.body);
    const result = await service.updateTipoDocumento(id, validatedData);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteTipoDocumento(id);
    res.json(result);
  } catch (error: any) {
    res.status(error instanceof z.ZodError ? 400 : 500).json({ message: error.message });
  }
};