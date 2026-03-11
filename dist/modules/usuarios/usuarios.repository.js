"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsuario = exports.updateUsuario = exports.crearUsuario = exports.getUsuarioByEmail = exports.getUsuarioById = exports.getUsuarios = void 0;
const database_1 = require("../../config/database");
const getUsuarios = async () => {
    const result = await database_1.pool.request().query(`
    SELECT 
      id_usuario,
      id_rol,
      id_tipo_documento,
      numero_documento,
      nombre,
      email,
      telefono,
      direccion,
      img
    FROM Usuarios 
    ORDER BY id_usuario
  `);
    return result.recordset;
};
exports.getUsuarios = getUsuarios;
const getUsuarioById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query(`
      SELECT 
        id_usuario,
        id_rol,
        id_tipo_documento,
        numero_documento,
        nombre,
        email,
        telefono,
        direccion,
        img
      FROM Usuarios 
      WHERE id_usuario = @id
    `);
    return result.recordset[0];
};
exports.getUsuarioById = getUsuarioById;
const getUsuarioByEmail = async (email) => {
    const result = await database_1.pool.request()
        .input("email", email)
        .query(`
      SELECT 
        id_usuario,
        id_rol,
        id_tipo_documento,
        numero_documento,
        nombre,
        email,
        telefono,
        direccion,
        img
      FROM Usuarios 
      WHERE email = @email
    `);
    return result.recordset[0];
};
exports.getUsuarioByEmail = getUsuarioByEmail;
const crearUsuario = async (data) => {
    const { id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img } = data;
    const idResult = await database_1.pool.request()
        .query("SELECT ISNULL(MAX(id_usuario), 0) + 1 AS nextId FROM Usuarios");
    const id_usuario = idResult.recordset[0].nextId;
    await database_1.pool
        .request()
        .input("id_usuario", id_usuario)
        .input("id_rol", id_rol)
        .input("id_tipo_documento", id_tipo_documento)
        .input("numero_documento", numero_documento)
        .input("nombre", nombre)
        .input("email", email || null)
        .input("telefono", telefono || null)
        .input("direccion", direccion || null)
        .input("contrasena", contrasena)
        .input("img", img || null)
        .query(`
      INSERT INTO Usuarios 
      (id_usuario, id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img) 
      VALUES (@id_usuario, @id_rol, @id_tipo_documento, @numero_documento, @nombre, @email, @telefono, @direccion, @contrasena, @img)
    `);
    return { id_usuario, mensaje: "Usuario creado exitosamente" };
};
exports.crearUsuario = crearUsuario;
const updateUsuario = async (id, data) => {
    const { nombre, email, telefono, direccion, img } = data;
    let query = "UPDATE Usuarios SET ";
    const request = database_1.pool.request().input("id", id);
    const updates = [];
    if (nombre !== undefined) {
        updates.push("nombre = @nombre");
        request.input("nombre", nombre);
    }
    if (email !== undefined) {
        updates.push("email = @email");
        request.input("email", email);
    }
    if (telefono !== undefined) {
        updates.push("telefono = @telefono");
        request.input("telefono", telefono);
    }
    if (direccion !== undefined) {
        updates.push("direccion = @direccion");
        request.input("direccion", direccion);
    }
    if (img !== undefined) {
        updates.push("img = @img");
        request.input("img", img);
    }
    if (updates.length === 0)
        return;
    query += updates.join(", ") + " WHERE id_usuario = @id";
    await request.query(query);
};
exports.updateUsuario = updateUsuario;
const deleteUsuario = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Usuarios WHERE id_usuario = @id");
};
exports.deleteUsuario = deleteUsuario;
