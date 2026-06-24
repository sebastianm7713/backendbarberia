"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermiso = exports.updatePermiso = exports.createPermisoIfNotExists = exports.findPermisoByNombre = exports.createPermiso = exports.getPermisoById = exports.getAllPermisos = void 0;
const database_1 = require("../../config/database");
const getAllPermisos = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM Permisos ORDER BY id_permiso");
    return result.recordset;
};
exports.getAllPermisos = getAllPermisos;
const getPermisoById = async (id) => {
    const result = await database_1.pool.request().input("id", id).query("SELECT * FROM Permisos WHERE id_permiso = @id");
    return result.recordset[0];
};
exports.getPermisoById = getPermisoById;
const createPermiso = async (data) => {
    const { nombre, descripcion } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_permiso), 0) + 1 AS nextId FROM Permisos");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("nombre", nombre)
        .input("descripcion", descripcion)
        .query("INSERT INTO Permisos (id_permiso, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");
};
exports.createPermiso = createPermiso;
const findPermisoByNombre = async (nombre) => {
    const result = await database_1.pool.request()
        .input("nombre", nombre)
        .query("SELECT * FROM Permisos WHERE nombre = @nombre");
    return result.recordset[0];
};
exports.findPermisoByNombre = findPermisoByNombre;
const createPermisoIfNotExists = async (data) => {
    const existing = await (0, exports.findPermisoByNombre)(data.nombre);
    if (existing)
        return existing;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_permiso), 0) + 1 AS nextId FROM Permisos");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("nombre", data.nombre)
        .input("descripcion", data.descripcion)
        .query("INSERT INTO Permisos (id_permiso, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");
    return { id_permiso: id, nombre: data.nombre, descripcion: data.descripcion };
};
exports.createPermisoIfNotExists = createPermisoIfNotExists;
const updatePermiso = async (id, data) => {
    const { nombre, descripcion } = data;
    const updates = [];
    const request = database_1.pool.request().input("id", id);
    if (nombre !== undefined) {
        updates.push("nombre = @nombre");
        request.input("nombre", nombre);
    }
    if (descripcion !== undefined) {
        updates.push("descripcion = @descripcion");
        request.input("descripcion", descripcion);
    }
    if (updates.length > 0) {
        await request.query(`UPDATE Permisos SET ${updates.join(", ")} WHERE id_permiso = @id`);
    }
};
exports.updatePermiso = updatePermiso;
const deletePermiso = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Permisos WHERE id_permiso = @id");
};
exports.deletePermiso = deletePermiso;
