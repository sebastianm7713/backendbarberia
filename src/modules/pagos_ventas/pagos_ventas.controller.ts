import { Request, Response } from "express";
import { pagosVentasService } from "./pagos_ventas.service";

export class PagosVentasController {
  async getAllPagos(req: Request, res: Response) {
    try {
      const { id_venta } = req.query;
      const pagos = await pagosVentasService.getAllPagos(
        id_venta ? Number(id_venta) : undefined
      );
      res.status(200).json({ success: true, data: pagos });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getPagoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pago = await pagosVentasService.getPagoById(Number(id));
      res.status(200).json({ success: true, data: pago });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async createPago(req: Request, res: Response) {
    try {
      const result = await pagosVentasService.createPago(req.body);
      res.status(201).json({ success: true, message: "Pago de venta creado exitosamente", id_pago: result.id_pago });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updatePago(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pagosVentasService.updatePago(Number(id), req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deletePago(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await pagosVentasService.deletePago(Number(id));
      res.status(200).json({ success: true, message: "Pago de venta eliminado exitosamente" });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}

export const pagosVentasController = new PagosVentasController();