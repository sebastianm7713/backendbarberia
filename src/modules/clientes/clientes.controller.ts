import { Request, Response } from "express";
import * as service from "./clientes.service";
import { z } from "zod";
import { createClienteSchema, updateClienteSchema, clienteIdSchema } from "./clientes.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const clientes = await service.getAllClientes();
    res.json(clientes);
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
    const { id: validatedId } = clienteIdSchema.parse({ id });
    const cliente = await service.getClienteById(validatedId);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente);
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
    const validatedData = createClienteSchema.parse(req.body);
    const result = await service.createCliente(validatedData);
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
    const { id: validatedId } = clienteIdSchema.parse({ id });
    const validatedData = updateClienteSchema.parse(req.body);
    const result = await service.updateCliente(validatedId, validatedData);
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
    const { id: validatedId } = clienteIdSchema.parse({ id });
    const result = await service.deleteCliente(validatedId);
    res.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "ID inválido", errors: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};