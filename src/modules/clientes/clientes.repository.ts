import { pool } from "../../config/database";

export const getAllClientes = async () => {
  const result = await pool.request().query(`
    SELECT
      c.id_cliente,
      c.id_usuario,
      c.estado,
      u.nombre,
      u.numero_documento,
      u.email,
      u.telefono,
      u.direccion,
      u.img
    FROM Clientes c
    INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario
    ORDER BY c.id_cliente
  `);
  return result.recordset;
};

export const getClienteById = async (id_cliente: number) => {
  const result = await pool.request()
    .input("id_cliente", id_cliente)
    .query(`
      SELECT
        c.id_cliente,
        c.id_usuario,
        c.estado,
        u.nombre,
        u.numero_documento,
        u.email,
        u.telefono,
        u.direccion,
        u.img
      FROM Clientes c
      INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_cliente = @id_cliente
    `);
  return result.recordset[0];
};

export const getClienteByUsuarioId = async (id_usuario: number) => {
  const result = await pool.request()
    .input("id_usuario", id_usuario)
    .query(`
      SELECT
        c.id_cliente,
        c.id_usuario,
        c.estado,
        u.nombre,
        u.numero_documento,
        u.email,
        u.telefono,
        u.direccion,
        u.img
      FROM Clientes c
      INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_usuario = @id_usuario
    `);
  return result.recordset[0];
};

export const createCliente = async (data: any) => {
  const { id_usuario, estado } = data;

  const result = await pool
    .request()
    .input("id_usuario", id_usuario)
    .input("estado", estado || "Activo")
    .query(`
      INSERT INTO Clientes (id_usuario, estado)
      OUTPUT INSERTED.id_cliente
      VALUES (@id_usuario, @estado)
    `);

  return result.recordset[0].id_cliente;
};

export const updateCliente = async (id_cliente: number, data: any) => {
  const { estado } = data;

  const result = await pool
    .request()
    .input("id_cliente", id_cliente)
    .input("estado", estado)
    .query(`
      UPDATE Clientes
      SET estado = @estado
      WHERE id_cliente = @id_cliente;
      
      SELECT
        c.id_cliente,
        c.id_usuario,
        c.estado,
        u.nombre,
        u.numero_documento,
        u.email,
        u.telefono,
        u.direccion,
        u.img
      FROM Clientes c
      INNER JOIN Usuarios u ON c.id_usuario = u.id_usuario
      WHERE c.id_cliente = @id_cliente
    `);
  
  return result.recordset[0];
};

export const deleteCliente = async (id_cliente: number) => {
  await pool
    .request()
    .input("id_cliente", id_cliente)
    .query(`
      DELETE FROM Clientes
      WHERE id_cliente = @id_cliente
    `);
};