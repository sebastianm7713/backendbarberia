import { Request, Response } from "express";
import * as service from "./tipo_documento.service";
import { z } from "zod";
import { createTipoDocumentoSchema, updateTipoDocumentoSchema, tipoDocumentoIdSchema } from "./tipo_documento.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const tipos = await service.getAllTiposDocumento();
    console.log('obtenerTodos result:', tipos);
    res.json({ success: true, data: tipos });
  } catch (error: any) {
    console.error('Error in obtenerTodos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    const tipo = await service.getTipoDocumentoById(id);
    if (!tipo) return res.status(404).json({ success: false, message: "Tipo de documento no encontrado" });
    console.log('obtenerPorId result:', tipo);
    res.json({ success: true, data: tipo });
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
    const validatedData = createTipoDocumentoSchema.parse(req.body);
    const result = await service.createTipoDocumento(validatedData);
    console.log('crear result:', result);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error in crear:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: "Datos inválidos", errors: error.issues });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateTipoDocumentoSchema.parse(req.body);
    const result = await service.updateTipoDocumento(id, validatedData);
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
    const { id } = tipoDocumentoIdSchema.parse({ id: parseInt(rawId) });
    const result = await service.deleteTipoDocumento(id);
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