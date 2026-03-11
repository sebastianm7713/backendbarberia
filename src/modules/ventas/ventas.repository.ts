import { pool } from "../../config/database";

export const crearVenta = async (data: any) => {
  const { id_cliente, id_barbero, total } = data;

  await pool
    .request()
    .input("id_cliente", id_cliente)
    .input("id_barbero", id_barbero)
    .input("total", total)
    .query(`
      INSERT INTO Ventas (id_cliente,id_barbero,total)
      VALUES (@id_cliente,@id_barbero,@total)
    `);
};