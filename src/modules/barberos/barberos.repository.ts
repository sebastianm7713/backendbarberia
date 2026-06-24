import { pool } from "../../config/database";

export const getAllBarberos = async () => {
  const result = await pool.request().query(`
    SELECT b.*, u.nombre, u.email, u.telefono
    FROM Barberos b
    JOIN Usuarios u ON b.id_usuario = u.id_usuario
    ORDER BY b.id_barbero
  `);
  return result.recordset;
};

export const getBarberoById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT b.*, u.nombre, u.email, u.telefono
      FROM Barberos b
      JOIN Usuarios u ON b.id_usuario = u.id_usuario
      WHERE b.id_barbero = @id
    `);
  return result.recordset[0];
};

export const createBarbero = async (data: any) => {
  const { id_usuario, tipo_contrato, porcentaje_ganancia, hora_inicio, hora_fin } = data;

  const idResult = await pool.request().query(
    "SELECT ISNULL(MAX(id_barbero), 0) + 1 AS nextId FROM Barberos"
  );
  const id_barbero = idResult.recordset[0].nextId;

  await pool
    .request()
    .input("id_barbero", id_barbero)
    .input("id_usuario", id_usuario)
    .input("tipo_contrato", tipo_contrato)
    .input("porcentaje_ganancia", porcentaje_ganancia || null)
    .input("hora_inicio", hora_inicio || "14:00")
    .input("hora_fin", hora_fin || "18:00")
    .query(`
      INSERT INTO Barberos (id_barbero, id_usuario, tipo_contrato, porcentaje_ganancia, hora_inicio, hora_fin)
      VALUES (@id_barbero, @id_usuario, @tipo_contrato, @porcentaje_ganancia, @hora_inicio, @hora_fin)
    `);

  return id_barbero;
};

export const updateBarbero = async (id: number, data: any) => {
  const { tipo_contrato, porcentaje_ganancia, hora_inicio, hora_fin, estado } = data;
  let query = "UPDATE Barberos SET ";
  const inputs: any[] = [];
  if (tipo_contrato !== undefined) {
    query += "tipo_contrato = @tipo_contrato, ";
    inputs.push({ name: "tipo_contrato", value: tipo_contrato });
  }
  if (porcentaje_ganancia !== undefined) {
    query += "porcentaje_ganancia = @porcentaje_ganancia, ";
    inputs.push({ name: "porcentaje_ganancia", value: porcentaje_ganancia });
  }
  if (hora_inicio !== undefined) {
    query += "hora_inicio = @hora_inicio, ";
    inputs.push({ name: "hora_inicio", value: hora_inicio });
  }
  if (hora_fin !== undefined) {
    query += "hora_fin = @hora_fin, ";
    inputs.push({ name: "hora_fin", value: hora_fin });
  }
  if (estado !== undefined) {
    query += "estado = @estado, ";
    inputs.push({ name: "estado", value: estado });
  }
  query = query.slice(0, -2) + " WHERE id_barbero = @id";
  inputs.push({ name: "id", value: id });

  const request = pool.request();
  inputs.forEach(input => request.input(input.name, input.value));
  await request.query(query);
};

export const deleteBarbero = async (id: number) => {
  await pool
    .request()
    .input("id", id)
    .query(`
      DELETE FROM Barberos WHERE id_barbero = @id
    `);
};