import { pool } from "../../config/database";

export const getAllDisponibilidades = async () => {
  const result = await pool.request().query(`
    SELECT d.*, b.id_usuario, u.nombre 
    FROM Disponibilidad_Excepcion d 
    JOIN Barberos b ON d.id_barbero = b.id_barbero 
    JOIN Usuarios u ON b.id_usuario = u.id_usuario
    ORDER BY d.fecha DESC
  `);
  return result.recordset;
};

export const getDisponibilidadById = async (id: number) => {
  const result = await pool.request()
    .input("id", id)
    .query(`
      SELECT d.*, b.id_usuario, u.nombre 
      FROM Disponibilidad_Excepcion d 
      JOIN Barberos b ON d.id_barbero = b.id_barbero 
      JOIN Usuarios u ON b.id_usuario = u.id_usuario
      WHERE d.id_excepcion = @id
    `);
  return result.recordset[0];
};

export const createDisponibilidad = async (data: any) => {
  const { id_barbero, fecha, estado, motivo, hora_inicio, hora_fin } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_excepcion), 0) + 1 AS nextId FROM Disponibilidad_Excepcion");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("id_barbero", id_barbero)
    .input("fecha", fecha)
    .input("estado", estado)
    .input("motivo", motivo)
    .input("hora_inicio", hora_inicio)
    .input("hora_fin", hora_fin)
    .query(`
      INSERT INTO Disponibilidad_Excepcion (id_excepcion, id_barbero, fecha, estado, motivo, hora_inicio, hora_fin)
      VALUES (@id, @id_barbero, @fecha, @estado, @motivo, @hora_inicio, @hora_fin)
    `);
};

export const updateDisponibilidad = async (id: number, data: any) => {
  const { estado, motivo, hora_inicio, hora_fin } = data;
  const updates = [];
  const request = pool.request().input("id", id);
  
  if (estado !== undefined) {
    updates.push("estado = @estado");
    request.input("estado", estado);
  }
  if (motivo !== undefined) {
    updates.push("motivo = @motivo");
    request.input("motivo", motivo);
  }
  if (hora_inicio !== undefined) {
    updates.push("hora_inicio = @hora_inicio");
    request.input("hora_inicio", hora_inicio);
  }
  if (hora_fin !== undefined) {
    updates.push("hora_fin = @hora_fin");
    request.input("hora_fin", hora_fin);
  }
  
  if (updates.length > 0) {
    await request.query(`UPDATE Disponibilidad_Excepcion SET ${updates.join(", ")} WHERE id_excepcion = @id`);
  }
};

export const deleteDisponibilidad = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Disponibilidad_Excepcion WHERE id_excepcion = @id");
};