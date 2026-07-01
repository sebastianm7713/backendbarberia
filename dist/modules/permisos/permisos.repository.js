"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermiso = exports.updatePermiso = exports.updateRolPermisoId = exports.deletePermisosByIds = exports.createPermisoIfNotExists = exports.findPermisoByNombre = exports.createPermiso = exports.getPermisoById = exports.getAllPermisos = void 0;
const database_1 = require("../../config/database");
const normalizeText = (value) => value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
    const normalizedName = normalizeText(nombre);
    const result = await database_1.pool.request().query("SELECT * FROM Permisos");
    const existing = result.recordset.find((permiso) => {
        const permisoNombre = permiso.nombre?.toString?.() ?? '';
        const normalizedPermisoNombre = normalizeText(permisoNombre);
        return normalizedPermisoNombre === normalizedName;
    });
    return existing;
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
const deletePermisosByIds = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0)
        return;
    const request = database_1.pool.request();
    const parameters = ids.map((id, idx) => {
        const key = `id${idx}`;
        request.input(key, id);
        return `@${key}`;
    });
    await request.query(`DELETE FROM Permisos WHERE id_permiso IN (${parameters.join(', ')})`);
};
exports.deletePermisosByIds = deletePermisosByIds;
const updateRolPermisoId = async (oldPermisoId, newPermisoId) => {
    await database_1.pool.request()
        .input('oldPermisoId', oldPermisoId)
        .input('newPermisoId', newPermisoId)
        .query(`
      UPDATE rp
      SET id_permiso = @newPermisoId
      FROM Rol_Permiso rp
      LEFT JOIN Rol_Permiso target
        ON target.id_rol = rp.id_rol
        AND target.id_permiso = @newPermisoId
      WHERE rp.id_permiso = @oldPermisoId
        AND target.id_rol IS NULL;

      DELETE FROM Rol_Permiso WHERE id_permiso = @oldPermisoId;
    `);
};
exports.updateRolPermisoId = updateRolPermisoId;
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
