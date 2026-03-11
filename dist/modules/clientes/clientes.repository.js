"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getAllClientes = void 0;
const database_1 = require("../../config/database");
const getAllClientes = async () => {
    const result = await database_1.pool.request().query(`
    SELECT * FROM Clientes ORDER BY nombre, apellido
  `);
    return result.recordset;
};
exports.getAllClientes = getAllClientes;
const getClienteById = async (id_cliente) => {
    const result = await database_1.pool.request()
        .input("id_cliente", id_cliente)
        .query(`
      SELECT * FROM Clientes WHERE id_cliente = @id_cliente
    `);
    return result.recordset[0] || null;
};
exports.getClienteById = getClienteById;
const createCliente = async (data) => {
    const { nombre, apellido, telefono, email, fecha_nacimiento } = data;
    const idResult = await database_1.pool.request().query(`
    SELECT ISNULL(MAX(id_cliente), 0) + 1 AS nextId FROM Clientes
  `);
    const id_cliente = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id_cliente", id_cliente)
        .input("nombre", nombre)
        .input("apellido", apellido)
        .input("telefono", telefono || null)
        .input("email", email || null)
        .input("fecha_nacimiento", fecha_nacimiento || null)
        .query(`
      INSERT INTO Clientes (id_cliente, nombre, apellido, telefono, email, fecha_nacimiento)
      VALUES (@id_cliente, @nombre, @apellido, @telefono, @email, @fecha_nacimiento)
    `);
    return id_cliente;
};
exports.createCliente = createCliente;
const updateCliente = async (id_cliente, data) => {
    const { nombre, apellido, telefono, email, fecha_nacimiento } = data;
    let query = "UPDATE Clientes SET ";
    const params = [];
    const inputs = [];
    if (nombre !== undefined) {
        params.push("nombre = @nombre");
        inputs.push({ name: "nombre", value: nombre });
    }
    if (apellido !== undefined) {
        params.push("apellido = @apellido");
        inputs.push({ name: "apellido", value: apellido });
    }
    if (telefono !== undefined) {
        params.push("telefono = @telefono");
        inputs.push({ name: "telefono", value: telefono });
    }
    if (email !== undefined) {
        params.push("email = @email");
        inputs.push({ name: "email", value: email });
    }
    if (fecha_nacimiento !== undefined) {
        params.push("fecha_nacimiento = @fecha_nacimiento");
        inputs.push({ name: "fecha_nacimiento", value: fecha_nacimiento });
    }
    if (params.length === 0) {
        throw new Error("No fields to update");
    }
    query += params.join(", ") + " WHERE id_cliente = @id_cliente";
    const request = database_1.pool.request();
    inputs.forEach(input => request.input(input.name, input.value));
    request.input("id_cliente", id_cliente);
    await request.query(query);
};
exports.updateCliente = updateCliente;
const deleteCliente = async (id_cliente) => {
    await database_1.pool.request()
        .input("id_cliente", id_cliente)
        .query("DELETE FROM Clientes WHERE id_cliente = @id_cliente");
};
exports.deleteCliente = deleteCliente;
