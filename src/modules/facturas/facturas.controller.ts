import { Request, Response } from "express";
import * as service from "./facturas.service";
import * as repository from "./facturas.repository";

export const getFacturas = async (req: Request, res: Response) => {
  const data = await repository.getFacturas();
  res.json(data);
};

export const getFactura = async (req: Request, res: Response) => {
  const { id } = req.params;
  const factura = await repository.getFacturaById(Number(id));
  if (!factura) return res.status(404).json({ message: "Factura no encontrada" });
  res.json(factura);
};

export const crearFactura = async (req: Request, res: Response) => {
  await service.crearFactura(req.body);
  res.json({ message: "Factura creada" });
};

export const eliminarFactura = async (req: Request, res: Response) => {
  const { id } = req.params;
  await repository.deleteFactura(Number(id));
  res.json({ message: "Factura eliminada" });
};
