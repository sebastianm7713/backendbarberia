import sql from "mssql";
import { pool } from "../../config/database";

export class PagosRealizadosRepository {
  async getAllPagos(estado_pago?: string) {
    const request = pool.request();
    let query = `
      SELECT 
        p.id_pago,
        p.id_compra,
        p.monto_pagado,
        p.fecha_pago,
        p.metodo_pago,
        p.referencia,
        c.total AS monto_total,
        c.estado_pago,
        (c.total - ISNULL(SUM(p2.monto_pagado), 0)) AS monto_pendiente
      FROM Pagos_Realizados p
      LEFT JOIN Compras c ON p.id_compra = c.id_compra
      LEFT JOIN Pagos_Realizados p2 ON c.id_compra = p2.id_compra AND p2.id_pago <= p.id_pago
      WHERE 1=1
    `;

    if (estado_pago) {
      request.input("estado_pago", sql.VarChar(50), estado_pago);
      query += ` AND c.estado_pago = @estado_pago`;
    }

    query += ` GROUP BY p.id_pago, p.id_compra, p.monto_pagado, p.fecha_pago, p.metodo_pago, p.referencia, c.total, c.estado_pago
      ORDER BY p.fecha_pago DESC`;

    const result = await request.query(query);
    return result.recordset;
  }

  async getPagoById(id_pago: number) {
    const request = pool.request();
    request.input("id_pago", sql.Int, id_pago);
    const result = await request.query(`
      SELECT 
        id_pago,
        id_compra,
        monto_pagado,
        fecha_pago,
        metodo_pago,
        referencia
      FROM Pagos_Realizados
      WHERE id_pago = @id_pago
    `);
    return result.recordset[0];
  }

  async createPago(
    id_compra: number,
    monto_pagado: number,
    fecha_pago: string | null,
    metodo_pago: string,
    referencia: string
  ) {
    const request = pool.request();

    // Obtener nuevo id_pago
    const idPagoResult = await request.query(`
      SELECT ISNULL(MAX(id_pago), 0) + 1 AS nextId
      FROM Pagos_Realizados
    `);
    const id_pago = idPagoResult.recordset[0].nextId;

    request.input("id_pago", sql.Int, id_pago);
    request.input("id_compra", sql.Int, id_compra);
    request.input("monto_pagado", sql.Decimal(12, 2), monto_pagado);
    request.input("fecha_pago", sql.DateTime2, fecha_pago || new Date());
    request.input("metodo_pago", sql.VarChar(50), metodo_pago);
    request.input("referencia", sql.VarChar(100), referencia);

    await request.query(`
      INSERT INTO Pagos_Realizados (id_pago, id_compra, monto_pagado, fecha_pago, metodo_pago, referencia)
      VALUES (@id_pago, @id_compra, @monto_pagado, @fecha_pago, @metodo_pago, @referencia);
    `);

    return { id_pago };
  }

  async updatePago(
    id_pago: number,
    updateData: {
      monto_pagado?: number;
      fecha_pago?: string;
      metodo_pago?: string;
      referencia?: string;
    }
  ) {
    const request = pool.request();
    request.input("id_pago", sql.Int, id_pago);

    let query = "UPDATE Pagos_Realizados SET ";
    const updates: string[] = [];

    if (updateData.monto_pagado !== undefined) {
      request.input("monto_pagado", sql.Decimal(12, 2), updateData.monto_pagado);
      updates.push("monto_pagado = @monto_pagado");
    }

    if (updateData.fecha_pago !== undefined) {
      request.input("fecha_pago", sql.DateTime2, updateData.fecha_pago);
      updates.push("fecha_pago = @fecha_pago");
    }

    if (updateData.metodo_pago !== undefined) {
      request.input("metodo_pago", sql.VarChar(50), updateData.metodo_pago);
      updates.push("metodo_pago = @metodo_pago");
    }

    if (updateData.referencia !== undefined) {
      request.input("referencia", sql.VarChar(100), updateData.referencia);
      updates.push("referencia = @referencia");
    }

    if (updates.length === 0) {
      const result = await request.query(
        "SELECT * FROM Pagos_Realizados WHERE id_pago = @id_pago"
      );
      return result.recordset[0];
    }

    query += updates.join(", ");
    query += " WHERE id_pago = @id_pago; SELECT * FROM Pagos_Realizados WHERE id_pago = @id_pago";

    const result = await request.query(query);
    return result.recordset[0];
  }

  async getCompraInfo(id_compra: number) {
    const request = pool.request();
    request.input("id_compra", sql.Int, id_compra);
    const result = await request.query(`
      SELECT 
        id_compra,
        total AS monto_total,
        estado_pago,
        (SELECT ISNULL(SUM(monto_pagado), 0) FROM Pagos_Realizados WHERE id_compra = @id_compra) AS monto_pagado
      FROM Compras
      WHERE id_compra = @id_compra
    `);
    return result.recordset[0];
  }

  async deletePago(id_pago: number) {
    const request = pool.request();
    request.input("id_pago", sql.Int, id_pago);

    await request.query("DELETE FROM Pagos_Realizados WHERE id_pago = @id_pago");
    return { success: true };
  }
}

export const pagosRealizadosRepository = new PagosRealizadosRepository();
