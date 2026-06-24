import { Request, Response } from "express";
import { pagosRealizadosService } from "./pagos_realizados.service";

export class PagosRealizadosController {
  async getAllPagos(req: Request, res: Response) {
    try {
      const { estado_pago } = req.query;
      const pagos = await pagosRealizadosService.getAllPagos(estado_pago as string | undefined);
      res.status(200).json(pagos);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAllPagosDebug(req: Request, res: Response) {
    try {
      const { estado_pago } = req.query;
      const pagos = await pagosRealizadosService.getAllPagos(estado_pago as string | undefined);
      res.status(200).json({ success: true, params: { estado_pago }, count: pagos.length, data: pagos });
    } catch (error) {
      console.error("DEBUG pagos-realizados error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getPagoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pago = await pagosRealizadosService.getPagoById(Number(id));
      res.status(200).json(pago);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async createPago(req: Request, res: Response) {
    try {
      const result = await pagosRealizadosService.createPago(req.body);
      res.status(201).json({
        message: "Pago creado exitosamente",
        id_pago: result.id_pago,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async createPagoConsignacion(req: Request, res: Response) {
    try {
      const result = await pagosRealizadosService.createPagoConsignacion(req.body);
      res.status(201).json({
        message: "Pago de consignación registrado exitosamente",
        id_pago: result.id_pago,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updatePago(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pagosRealizadosService.updatePago(Number(id), req.body);
      res.status(200).json({
        message: "Pago actualizado exitosamente",
        data: result,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deletePago(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await pagosRealizadosService.deletePago(Number(id));
      res.status(200).json({ message: "Pago eliminado exitosamente" });
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }
}

export const pagosRealizadosController = new PagosRealizadosController();
