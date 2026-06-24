import { Request, Response } from "express";
import * as service from "./clientes.service";
import { z } from "zod";
import { createClienteSchema, updateClienteSchema, clienteIdSchema } from "./clientes.schema";

export const obtenerTodos = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userRole = Number(user?.rol ?? user?.role ?? user?.id_rol ?? -1);
    const userId = Number(user?.id_usuario ?? user?.id ?? user?.userId ?? null);

    if ([1, 2, 4, 5].includes(userRole)) {
      const clientes = await service.getAllClientes();
      console.log('obtenerTodos clientes result:', clientes);
      return res.json({ success: true, data: clientes });
    }

    if (userRole === 3) {
      if (!userId) {
        return res.status(400).json({ success: false, message: 'No se pudo identificar al cliente autenticado' });
      }
      const cliente = await service.getClienteByUsuarioId(userId);
      console.log('obtenerTodos cliente own result:', cliente);
      if (!cliente) {
        return res.status(404).json({ success: false, message: 'Cliente no encontrado para el usuario autenticado' });
      }
      return res.json({ success: true, data: [cliente] });
    }

    return res.status(403).json({ success: false, message: 'No autorizado' });
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
    const { id: validatedId } = clienteIdSchema.parse({ id });
    const cliente = await service.getClienteById(validatedId);
    console.log('obtenerPorId cliente result:', cliente);
    if (!cliente) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado" });
    }

    const user = (req as any).user;
    const userRole = Number(user?.rol ?? user?.role ?? user?.id_rol ?? -1);
    const userId = Number(user?.id_usuario ?? user?.id ?? user?.userId ?? null);

    if (userRole === 3 && cliente.id_usuario !== userId) {
      return res.status(403).json({ success: false, message: 'No autorizado para ver este cliente' });
    }

    res.json({ success: true, data: cliente });
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
    const validatedData = createClienteSchema.parse(req.body);
    const result = await service.createCliente(validatedData);
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
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }
    const { id: validatedId } = clienteIdSchema.parse({ id });
    console.log('actualizar req.body:', req.body);
    const validatedData = updateClienteSchema.parse(req.body);
    const result = await service.updateCliente(validatedId, validatedData);
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
    const { id: validatedId } = clienteIdSchema.parse({ id });
    const result = await service.deleteCliente(validatedId);
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