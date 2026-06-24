import { pool } from "../../config/database";

export const getServicios = async () => {
  const result = await pool.request().query(`
    SELECT * FROM Servicios
  `);

  return result.recordset;
};

export const createServicio = async (data: any) => {
  const { nombre, descripcion, precio, duracion, porcentaje_barbero, imagen, img } = data;
  const imagenValue = imagen ?? img;

  const result = await pool
    .request()
    .input("nombre", nombre)
    .input("descripcion", descripcion)
    .input("precio", precio)
    .input("duracion", duracion)
    .input("porcentaje_barbero", porcentaje_barbero)
    .input("imagen", imagenValue)
    .query(`
      INSERT INTO Servicios
      (nombre, descripcion, precio, duracion, porcentaje_barbero, imagen)
      OUTPUT INSERTED.id_servicio
      VALUES
      (@nombre, @descripcion, @precio, @duracion, @porcentaje_barbero, @imagen)
    `);

  return result.recordset[0];
};

export const getServicioById = async (id: number) => {
  const result = await pool.request()
    .input("id", id)
    .query(`SELECT * FROM Servicios WHERE id_servicio = @id`);
  return result.recordset[0];
};

export const updateServicio = async (id: number, data: any) => {
  const { nombre, descripcion, precio, duracion, porcentaje_barbero, imagen, img } = data;
  const imagenValue = imagen ?? img;
  let query = "UPDATE Servicios SET ";
  const request = pool.request().input("id", id);
  const updates: string[] = [];

  if (nombre !== undefined) {
    updates.push("nombre = @nombre");
    request.input("nombre", nombre);
  }
  if (descripcion !== undefined) {
    updates.push("descripcion = @descripcion");
    request.input("descripcion", descripcion);
  }
  if (precio !== undefined) {
    updates.push("precio = @precio");
    request.input("precio", precio);
  }
  if (duracion !== undefined) {
    updates.push("duracion = @duracion");
    request.input("duracion", duracion);
  }
  if (porcentaje_barbero !== undefined) {
    updates.push("porcentaje_barbero = @porcentaje_barbero");
    request.input("porcentaje_barbero", porcentaje_barbero);
  }
  if (imagenValue !== undefined) {
    updates.push("imagen = @imagen");
    request.input("imagen", imagenValue);
  }

  if (updates.length === 0) return;
  query += updates.join(", ") + " WHERE id_servicio = @id; SELECT * FROM Servicios WHERE id_servicio = @id";
  const result = await request.query(query);
  return result.recordset[0];
};

export const deleteServicio = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Servicios WHERE id_servicio = @id");
};