import { pool } from "../../config/database";

export const getAllCategorias = async () => {
  const result = await pool.request().query("SELECT * FROM Categorias_Productos ORDER BY id_categoria");
  return result.recordset;
};

export const getCategoriaById = async (id: number) => {
  const result = await pool.request().input("id", id).query("SELECT * FROM Categorias_Productos WHERE id_categoria = @id");
  return result.recordset[0];
};

export const createCategoria = async (data: any) => {
  const { nombre, descripcion } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_categoria), 0) + 1 AS nextId FROM Categorias_Productos");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("nombre", nombre)
    .input("descripcion", descripcion || null)
    .query("INSERT INTO Categorias_Productos (id_categoria, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");
};

export const updateCategoria = async (id: number, data: any) => {
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
    await request.query(`UPDATE Categorias_Productos SET ${updates.join(", ")} WHERE id_categoria = @id`);
  }
};

export const deleteCategoria = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Categorias_Productos WHERE id_categoria = @id");
};