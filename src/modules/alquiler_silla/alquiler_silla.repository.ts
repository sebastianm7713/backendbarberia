import { pool } from "../../config/database";

export const getAllAlquileres = async () => {
  const result = await pool.request().query(`
    SELECT a.*, b.id_usuario, u.nombre 
    FROM Alquiler_Silla a 
    JOIN Barberos b ON a.id_barbero = b.id_barbero 
    JOIN Usuarios u ON b.id_usuario = u.id_usuario
  `);
  return result.recordset;
};

export const getAlquilerById = async (id: number) => {
  const result = await pool.request()
    .input("id", id)
    .query(`
      SELECT a.*, b.id_usuario, u.nombre 
      FROM Alquiler_Silla a 
      JOIN Barberos b ON a.id_barbero = b.id_barbero 
      JOIN Usuarios u ON b.id_usuario = u.id_usuario
      WHERE a.id_alquiler = @id
    `);
  return result.recordset[0];
};

export const createAlquiler = async (data: any) => {
  const { id_barbero, monto, periodo } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_alquiler), 0) + 1 AS nextId FROM Alquiler_Silla");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("id_barbero", id_barbero)
    .input("monto", monto)
    .input("periodo", periodo)
    .query("INSERT INTO Alquiler_Silla (id_alquiler, id_barbero, monto, periodo) VALUES (@id, @id_barbero, @monto, @periodo)");
};

export const updateAlquiler = async (id: number, data: any) => {
  const { monto, periodo, estado } = data;
  const updates = [];
  const request = pool.request().input("id", id);
  
  if (monto !== undefined) {
    updates.push("monto = @monto");
    request.input("monto", monto);
  }
  if (periodo !== undefined) {
    updates.push("periodo = @periodo");
    request.input("periodo", periodo);
  }
  if (estado !== undefined) {
    updates.push("estado = @estado");
    request.input("estado", estado);
  }
  
  if (updates.length > 0) {
    await request.query(`UPDATE Alquiler_Silla SET ${updates.join(", ")} WHERE id_alquiler = @id`);
  }
};

export const deleteAlquiler = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Alquiler_Silla WHERE id_alquiler = @id");
};