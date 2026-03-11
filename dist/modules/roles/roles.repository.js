"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRol = exports.updateRol = exports.createRol = exports.getRolById = exports.getAllRoles = void 0;
const database_1 = require("../../config/database");
const getAllRoles = async () => {
    const result = await database_1.pool.request().query(`
    SELECT * FROM Roles ORDER BY id_rol
  `);
    return result.recordset;
};
exports.getAllRoles = getAllRoles;
const getRolById = async (id) => {
    const result = await database_1.pool
        .request()
        .input("id", id)
        .query(`
      SELECT * FROM Roles WHERE id_rol = @id
    `);
    return result.recordset[0];
};
exports.getRolById = getRolById;
const createRol = async (data) => {
    const { nombre, descripcion } = data;
    await database_1.pool
        .request()
        .input("nombre", nombre)
        .input("descripcion", descripcion || null)
        .query(`
      INSERT INTO Roles (nombre, descripcion)
      VALUES (@nombre, @descripcion)
    `);
};
exports.createRol = createRol;
const updateRol = async (id, data) => {
    const { nombre, descripcion } = data;
    let query = "UPDATE Roles SET ";
    const inputs = [];
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
    const request = database_1.pool.request();
    inputs.forEach(input => request.input(input.name, input.value));
    await request.query(query);
};
exports.updateRol = updateRol;
const deleteRol = async (id) => {
    await database_1.pool
        .request()
        .input("id", id)
        .query(`
      DELETE FROM Roles WHERE id_rol = @id
    `);
};
exports.deleteRol = deleteRol;
