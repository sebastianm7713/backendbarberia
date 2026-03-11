"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTipoDocumento = exports.updateTipoDocumento = exports.createTipoDocumento = exports.getTipoDocumentoById = exports.getAllTiposDocumento = void 0;
const database_1 = require("../../config/database");
const getAllTiposDocumento = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM Tipo_Documento ORDER BY id_tipo_documento");
    return result.recordset;
};
exports.getAllTiposDocumento = getAllTiposDocumento;
const getTipoDocumentoById = async (id) => {
    const result = await database_1.pool.request()
        .input("id", id)
        .query("SELECT * FROM Tipo_Documento WHERE id_tipo_documento = @id");
    return result.recordset[0];
};
exports.getTipoDocumentoById = getTipoDocumentoById;
const createTipoDocumento = async (data) => {
    const { nombre, descripcion, estado } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_tipo_documento), 0) + 1 AS nextId FROM Tipo_Documento");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("nombre", nombre)
        .input("descripcion", descripcion || null)
        .input("estado", estado || "Activo")
        .query("INSERT INTO Tipo_Documento (id_tipo_documento, nombre, descripcion, estado) VALUES (@id, @nombre, @descripcion, @estado)");
};
exports.createTipoDocumento = createTipoDocumento;
const updateTipoDocumento = async (id, data) => {
    const { nombre, descripcion, estado } = data;
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
    if (estado !== undefined) {
        updates.push("estado = @estado");
        request.input("estado", estado);
    }
    if (updates.length > 0) {
        await request.query(`UPDATE Tipo_Documento SET ${updates.join(", ")} WHERE id_tipo_documento = @id`);
    }
};
exports.updateTipoDocumento = updateTipoDocumento;
const deleteTipoDocumento = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Tipo_Documento WHERE id_tipo_documento = @id");
};
exports.deleteTipoDocumento = deleteTipoDocumento;
