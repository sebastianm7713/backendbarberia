import { pool } from "../../config/database";

export const getAllMarcas = async () => {
  const result = await pool.request().query("SELECT * FROM Marcas ORDER BY id_marca");
  return result.recordset;
};

export const getMarcaById = async (id: number) => {
  const result = await pool.request().input("id", id).query("SELECT * FROM Marcas WHERE id_marca = @id");
  return result.recordset[0];
};

export const createMarca = async (data: any) => {
  const { nombre } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_marca), 0) + 1 AS nextId FROM Marcas");
  const id = idResult.recordset[0].nextId;
  
  await pool.request()
    .input("id", id)
    .input("nombre", nombre)
    .query("INSERT INTO Marcas (id_marca, nombre) VALUES (@id, @nombre)");
};

export const updateMarca = async (id: number, data: any) => {
  const { nombre } = data;
  if (nombre !== undefined) {
    await pool.request()
      .input("id", id)
      .input("nombre", nombre)
      .query("UPDATE Marcas SET nombre = @nombre WHERE id_marca = @id");
  }
};

export const deleteMarca = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Marcas WHERE id_marca = @id");
};