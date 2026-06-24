"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagosVentasRepository = exports.PagosVentasRepository = void 0;
const mssql_1 = __importDefault(require("mssql"));
const database_1 = require("../../config/database");
class PagosVentasRepository {
    async getAllPagos(id_venta) {
        const request = database_1.pool.request();
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
            request.input("id_venta", mssql_1.default.Int, id_venta);
            query += " AND p.id_venta = @id_venta";
        }
        query += `
      GROUP BY p.id_pago, p.id_venta, p.monto_pagado, p.fecha_pago, p.metodo_pago, p.referencia, v.total
      ORDER BY p.fecha_pago DESC
    `;
        const result = await request.query(query);
        return result.recordset;
    }
    async getPagoById(id_pago) {
        const request = database_1.pool.request();
        request.input("id_pago", mssql_1.default.Int, id_pago);
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
    async createPago(id_venta, monto_pagado, fecha_pago, metodo_pago, referencia) {
        const request = database_1.pool.request();
        request.input("id_venta", mssql_1.default.Int, id_venta);
        request.input("monto_pagado", mssql_1.default.Decimal(12, 2), monto_pagado);
        request.input("fecha_pago", mssql_1.default.DateTime2, fecha_pago || new Date());
        request.input("metodo_pago", mssql_1.default.VarChar(50), metodo_pago);
        request.input("referencia", mssql_1.default.VarChar(100), referencia);
        const result = await request.query(`
      INSERT INTO Pagos_Ventas (id_venta, monto_pagado, fecha_pago, metodo_pago, referencia)
      VALUES (@id_venta, @monto_pagado, @fecha_pago, @metodo_pago, @referencia);
      SELECT SCOPE_IDENTITY() AS id_pago;
    `);
        return { id_pago: result.recordset[0].id_pago };
    }
    async updatePago(id_pago, updateData) {
        const request = database_1.pool.request();
        request.input("id_pago", mssql_1.default.Int, id_pago);
        let query = "UPDATE Pagos_Ventas SET ";
        const updates = [];
        if (updateData.monto_pagado !== undefined) {
            request.input("monto_pagado", mssql_1.default.Decimal(12, 2), updateData.monto_pagado);
            updates.push("monto_pagado = @monto_pagado");
        }
        if (updateData.fecha_pago !== undefined) {
            request.input("fecha_pago", mssql_1.default.DateTime2, updateData.fecha_pago);
            updates.push("fecha_pago = @fecha_pago");
        }
        if (updateData.metodo_pago !== undefined) {
            request.input("metodo_pago", mssql_1.default.VarChar(50), updateData.metodo_pago);
            updates.push("metodo_pago = @metodo_pago");
        }
        if (updateData.referencia !== undefined) {
            request.input("referencia", mssql_1.default.VarChar(100), updateData.referencia);
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
    async getVentaInfo(id_venta) {
        const request = database_1.pool.request();
        request.input("id_venta", mssql_1.default.Int, id_venta);
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
    async deletePago(id_pago) {
        const request = database_1.pool.request();
        request.input("id_pago", mssql_1.default.Int, id_pago);
        await request.query("DELETE FROM Pagos_Ventas WHERE id_pago = @id_pago");
        return { success: true };
    }
}
exports.PagosVentasRepository = PagosVentasRepository;
exports.pagosVentasRepository = new PagosVentasRepository();
