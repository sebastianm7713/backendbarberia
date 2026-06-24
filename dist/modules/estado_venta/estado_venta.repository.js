"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEstadoVentaById = exports.getAllEstadosVenta = void 0;
const database_1 = require("../../config/database");
const getAllEstadosVenta = async () => {
    const result = await database_1.pool.request().query(`
    SELECT id_estado, nombre_estado
    FROM Estado_Venta
    ORDER BY id_estado
  `);
    return result.recordset;
};
exports.getAllEstadosVenta = getAllEstadosVenta;
const getEstadoVentaById = async (id) => {
    const result = await database_1.pool.request()
        .input("id_estado", id)
        .query(`
      SELECT id_estado, nombre_estado
      FROM Estado_Venta
      WHERE id_estado = @id_estado
    `);
    return result.recordset[0];
};
exports.getEstadoVentaById = getEstadoVentaById;
