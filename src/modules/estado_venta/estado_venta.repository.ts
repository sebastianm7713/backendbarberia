import { pool } from "../../config/database";

export const getAllEstadosVenta = async () => {
  const result = await pool.request().query(`
    SELECT id_estado, nombre_estado
    FROM Estado_Venta
    ORDER BY id_estado
  `);

  return result.recordset;
};

export const getEstadoVentaById = async (id: number) => {
  const result = await pool.request()
    .input("id_estado", id)
    .query(`
      SELECT id_estado, nombre_estado
      FROM Estado_Venta
      WHERE id_estado = @id_estado
    `);

  return result.recordset[0];
};