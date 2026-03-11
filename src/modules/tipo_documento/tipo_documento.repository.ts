import { pool } from "../../config/database";

export const getAllTiposDocumento = async () => {
  const result = await pool.request().query("SELECT * FROM Tipo_Documento ORDER BY id_tipo_documento");
  return result.recordset;
};

export const getTipoDocumentoById = async (id: number) => {
  const result = await pool.request()
    .input("id", id)
    .query("SELECT * FROM Tipo_Documento WHERE id_tipo_documento = @id");
  return result.recordset[0];
};

export const createTipoDocumento = async (data: any) => {
  const { nombre, descripcion, estado } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_tipo_documento), 0) + 1 AS nextId FROM Tipo_Documento");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("nombre", nombre)
    .input("descripcion", descripcion || null)
    .input("estado", estado || "Activo")
    .query("INSERT INTO Tipo_Documento (id_tipo_documento, nombre, descripcion, estado) VALUES (@id, @nombre, @descripcion, @estado)");
};

export const updateTipoDocumento = async (id: number, data: any) => {
  const { nombre, descripcion, estado } = data;
  const updates = [];
  const request = pool.request().input("id", id);
  
  if (nombre !== undefined) {
    updates.push("nombre = @nombre");
    request.input("nombre", nombre);
  }
  if (descripcion !== undefined) {
    updates.push("descripcion = @descripcion");
    request.input("descripcion", descripcion);
  }
  if (estado !== undefined) {
    updates.push("estado = @estado");
    request.input("estado", estado);
  }
  
  if (updates.length > 0) {
    await request.query(`UPDATE Tipo_Documento SET ${updates.join(", ")} WHERE id_tipo_documento = @id`);
  }
};

export const deleteTipoDocumento = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Tipo_Documento WHERE id_tipo_documento = @id");
};