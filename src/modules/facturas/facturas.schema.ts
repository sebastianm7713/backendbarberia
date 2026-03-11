import { z } from "zod";

export const createFacturaSchema = z.object({
  cliente_id: z.number().int().positive(),
  detalles: z.array(
    z.object({
      producto_id: z.number().int().positive(),
      cantidad: z.number().int().positive(),
    })
  ),
});

export const facturaIdSchema = z.object({
  id: z.number().int().positive(),
});
