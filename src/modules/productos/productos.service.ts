import { pool } from "../../config/database";

export const getProductos = async () => {
  const result = await pool.request().query("SELECT * FROM productos");
  return result.recordset;
};