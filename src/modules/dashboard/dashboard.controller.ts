import { Request, Response } from "express";
import * as service from "./dashboard.service";

export const obtenerDashboardHoy = async (_req: Request, res: Response) => {
  try {
    const data = await service.dashboardHoy();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};