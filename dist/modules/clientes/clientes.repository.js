"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteByUsuarioId = exports.getClienteById = exports.getAllClientes = void 0;
const database_1 = require("../../config/database");
const getAllClientes = async () => {
    const result = await database_1.pool.request().query(`
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
exports.getAllClientes = getAllClientes;
const getClienteById = async (id_cliente) => {
    const result = await database_1.pool.request()
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
exports.getClienteById = getClienteById;
const getClienteByUsuarioId = async (id_usuario) => {
    const result = await database_1.pool.request()
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
exports.getClienteByUsuarioId = getClienteByUsuarioId;
const createCliente = async (data) => {
    const { id_usuario, estado } = data;
    const result = await database_1.pool
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
exports.createCliente = createCliente;
const updateCliente = async (id_cliente, data) => {
    const { estado } = data;
    const result = await database_1.pool
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
exports.updateCliente = updateCliente;
const deleteCliente = async (id_cliente) => {
    await database_1.pool
        .request()
        .input("id_cliente", id_cliente)
        .query(`
      DELETE FROM Clientes
      WHERE id_cliente = @id_cliente
    `);
};
exports.deleteCliente = deleteCliente;
