import { pool } from "../../config/database";

export const crear = async (data: any) => {
  await pool.request()
    .input("cliente_id", data.cliente_id)
    .input("fecha", data.fecha)
    .input("servicio_id", data.servicio_id)
    .query(`
      INSERT INTO citas (cliente_id, fecha, servicio_id)
      VALUES (@cliente_id, @fecha, @servicio_id)
    `);
};