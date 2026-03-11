import { Request, Response } from "express";
import { getProductos } from "./productos.service";

export const listar = async (_: Request, res: Response) => {
  res.json(await getProductos());
};