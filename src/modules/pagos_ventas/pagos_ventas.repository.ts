import sql from "mssql";
import { pool } from "../../config/database";

export class PagosVentasRepository {
  async getAllPagos(id_venta?: number) {
    const request = pool.request();
    let query = `
      SELECT
        p.id_pago,
        p.id_venta,
        p.monto_pagado,
        p.fecha_pago,
        p.metodo_pago,
        p.referencia,
        v.total AS monto_total,
        (v.total - ISNULL(SUM(p2.monto_pagado), 0)) AS monto_pendiente,
        'venta' AS tipo_factura
      FROM Pagos_Ventas p
      JOIN Ventas v ON p.id_venta = v.id_ventas
      LEFT JOIN Pagos_Ventas p2 ON v.id_ventas = p2.id_venta AND p2.id_pago <= p.id_pago
      WHERE 1=1
    `;

    if (id_venta !== undefined) {
      request.input("id_venta", sql.Int, id_venta);
      query += " AND p.id_venta = @id_venta";
    }

    query += `
      GROUP BY p.id_pago, p.id_venta, p.monto_pagado, p.fecha_pago, p.metodo_pago, p.referencia, v.total
      ORDER BY p.fecha_pago DESC
    `;

    const result = await request.query(query);
    return result.recordset;
  }

  async getPagoById(id_pago: number) {
    const request = pool.request();
    request.input("id_pago", sql.Int, id_pago);
    const result = await request.query(`
      SELECT
        id_pago,
        id_venta,
        monto_pagado,
        fecha_pago,
        metodo_pago,
        referencia
      FROM Pagos_Ventas
      WHERE id_pago = @id_pago
    `);
    return result.recordset[0];
  }

  async createPago(
    id_venta: number,
    monto_pagado: number,
    fecha_pago: string | null,
    metodo_pago: string,
    referencia: string
  ) {
    const request = pool.request();
    request.input("id_venta", sql.Int, id_venta);
    request.input("monto_pagado", sql.Decimal(12, 2), monto_pagado);
    request.input("fecha_pago", sql.DateTime2, fecha_pago || new Date());
    request.input("metodo_pago", sql.VarChar(50), metodo_pago);
    request.input("referencia", sql.VarChar(100), referencia);

    const result = await request.query(`
      INSERT INTO Pagos_Ventas (id_venta, monto_pagado, fecha_pago, metodo_pago, referencia)
      VALUES (@id_venta, @monto_pagado, @fecha_pago, @metodo_pago, @referencia);
      SELECT SCOPE_IDENTITY() AS id_pago;
    `);

    return { id_pago: result.recordset[0].id_pago };
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

    let query = "UPDATE Pagos_Ventas SET ";
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
      const result = await request.query("SELECT * FROM Pagos_Ventas WHERE id_pago = @id_pago");
      return result.recordset[0];
    }

    query += updates.join(", ");
    query += " WHERE id_pago = @id_pago; SELECT * FROM Pagos_Ventas WHERE id_pago = @id_pago";

    const result = await request.query(query);
    return result.recordset[0];
  }

  async getVentaInfo(id_venta: number) {
    const request = pool.request();
    request.input("id_venta", sql.Int, id_venta);
    const result = await request.query(`
      SELECT
        id_ventas,
        total AS monto_total,
        (SELECT ISNULL(SUM(monto_pagado), 0) FROM Pagos_Ventas WHERE id_venta = @id_venta) AS monto_pagado
      FROM Ventas
      WHERE id_ventas = @id_venta
    `);
    return result.recordset[0];
  }

  async deletePago(id_pago: number) {
    const request = pool.request();
    request.input("id_pago", sql.Int, id_pago);
    await request.query("DELETE FROM Pagos_Ventas WHERE id_pago = @id_pago");
    return { success: true };
  }
}

export const pagosVentasRepository = new PagosVentasRepository();