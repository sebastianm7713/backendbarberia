import { Request, Response } from "express";
import * as serviciosService from "./services.service";

export const getServicios = async (req: Request, res: Response) => {
  const data = await serviciosService.getServicios();
  res.json(data);
};

export const createServicio = async (req: Request, res: Response) => {
  const data = await serviciosService.createServicio(req.body);
  res.json({
    message: "Servicio creado",
    data
  });
};