import { pool } from "../../config/database";

export const getAllPermisos = async () => {
  const result = await pool.request().query("SELECT * FROM Permisos ORDER BY id_permiso");
  return result.recordset;
};

export const getPermisoById = async (id: number) => {
  const result = await pool.request().input("id", id).query("SELECT * FROM Permisos WHERE id_permiso = @id");
  return result.recordset[0];
};

export const createPermiso = async (data: any) => {
  const { nombre, descripcion } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_permiso), 0) + 1 AS nextId FROM Permisos");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("nombre", nombre)
    .input("descripcion", descripcion)
    .query("INSERT INTO Permisos (id_permiso, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");
};

export const updatePermiso = async (id: number, data: any) => {
  const { nombre, descripcion } = data;
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
  
  if (updates.length > 0) {
    await request.query(`UPDATE Permisos SET ${updates.join(", ")} WHERE id_permiso = @id`);
  }
};

export const deletePermiso = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Permisos WHERE id_permiso = @id");
};