import { pool } from "../../config/database";

export const getFacturas = async () => {
  const result = await pool.request().query(
    `SELECT * FROM facturas ORDER BY id`);
  return result.recordset;
};

export const getFacturaById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query(`SELECT * FROM facturas WHERE id = @id`);
  return result.recordset[0];
};

// the creation logic is handled in service using transaction

export const deleteFactura = async (id: number) => {
  await pool
    .request()
    .input("id", id)
    .query(`DELETE FROM factura_detalle WHERE factura_id = @id`);
  await pool
    .request()
    .input("id", id)
    .query(`DELETE FROM facturas WHERE id = @id`);
};
