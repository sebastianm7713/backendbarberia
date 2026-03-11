import { pool } from "../../config/database";

export const getServicios = async () => {
  const result = await pool.request().query(`
    SELECT * FROM Servicios
  `);

  return result.recordset;
};

export const createServicio = async (data: any) => {
  const { nombre, descripcion, precio, duracion, porcentaje_barbero } = data;

  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("descripcion", descripcion)
    .input("precio", precio)
    .input("duracion", duracion)
    .input("porcentaje_barbero", porcentaje_barbero)
    .query(`
      INSERT INTO Servicios
      (nombre, descripcion, precio, duracion, porcentaje_barbero)
      VALUES
      (@nombre, @descripcion, @precio, @duracion, @porcentaje_barbero)
    `);

  return result;
};