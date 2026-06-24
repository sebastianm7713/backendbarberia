import { pool } from "../../config/database";

export const crear = async (data: any) => {
  await pool.request()
    .input("id_cita", data.id_cita)
    .input("id_cliente", data.id_cliente)
    .input("id_barbero", data.id_barbero)
    .input("id_servicio", data.id_servicio || null)
    .input("fecha", data.fecha)
    .input("hora", data.hora)
    .query(`
      INSERT INTO Citas 
      (id_cita, id_cliente, id_barbero, id_servicio, fecha, hora)
      VALUES 
      (@id_cita, @id_cliente, @id_barbero, @id_servicio, @fecha, @hora)
    `);
};

export const listarCitas = async () => {
  const result = await pool.request().query(`
    SELECT 
      c.id_cita,
      c.id_cliente,              -- ← AGREGAR ID
      c.id_barbero,              -- ← AGREGAR ID
      c.id_servicio,             -- ← AGREGAR ID
      c.fecha,
      c.hora,
      c.estado,
      c.notificado,
      u_cliente.nombre AS cliente_nombre,
      u_barbero.nombre AS barbero_nombre,
      s.nombre AS servicio_nombre
    FROM Citas c
    JOIN Clientes cl ON c.id_cliente = cl.id_cliente
    JOIN Usuarios u_cliente ON cl.id_usuario = u_cliente.id_usuario
    JOIN Barberos b ON c.id_barbero = b.id_barbero
    JOIN Usuarios u_barbero ON b.id_usuario = u_barbero.id_usuario
    LEFT JOIN Servicios s ON c.id_servicio = s.id_servicio
    ORDER BY c.fecha, c.hora
  `);

  return result.recordset;
};