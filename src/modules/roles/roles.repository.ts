import { pool } from "../../config/database";

export const getAllRoles = async () => {
  const result = await pool.request().query(`
    SELECT * FROM Roles ORDER BY id_rol
  `);
  return result.recordset;
};

export const getRolById = async (id: number) => {
  const result = await pool
    .request()
    .input("id", id)
    .query(`
      SELECT * FROM Roles WHERE id_rol = @id
    `);
  return result.recordset[0];
};

export const createRol = async (data: any) => {
  const { nombre, descripcion } = data;
  await pool
    .request()
    .input("nombre", nombre)
    .input("descripcion", descripcion || null)
    .query(`
      INSERT INTO Roles (nombre, descripcion)
      VALUES (@nombre, @descripcion)
    `);
};

export const updateRol = async (id: number, data: any) => {
  const { nombre, descripcion } = data;
  let query = "UPDATE Roles SET ";
  const inputs: any[] = [];
  if (nombre !== undefined) {
    query += "nombre = @nombre, ";
    inputs.push({ name: "nombre", value: nombre });
  }
  if (descripcion !== undefined) {
    query += "descripcion = @descripcion, ";
    inputs.push({ name: "descripcion", value: descripcion });
  }
  query = query.slice(0, -2) + " WHERE id_rol = @id";
  inputs.push({ name: "id", value: id });

  const request = pool.request();
  inputs.forEach(input => request.input(input.name, input.value));
  await request.query(query);
};

export const deleteRol = async (id: number) => {
  await pool
    .request()
    .input("id", id)
    .query(`
      DELETE FROM Roles WHERE id_rol = @id
    `);
};