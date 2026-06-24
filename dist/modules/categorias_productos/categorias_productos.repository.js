"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoria = exports.updateCategoria = exports.createCategoria = exports.getCategoriaById = exports.getAllCategorias = void 0;
const database_1 = require("../../config/database");
const getAllCategorias = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM Categorias_Productos ORDER BY id_categoria");
    return result.recordset;
};
exports.getAllCategorias = getAllCategorias;
const getCategoriaById = async (id) => {
    const result = await database_1.pool.request().input("id", id).query("SELECT * FROM Categorias_Productos WHERE id_categoria = @id");
    return result.recordset[0];
};
exports.getCategoriaById = getCategoriaById;
const createCategoria = async (data) => {
    const { nombre, descripcion, estado } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_categoria), 0) + 1 AS nextId FROM Categorias_Productos");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("nombre", nombre)
        .input("descripcion", descripcion || null)
        .input("estado", estado || 'Activo')
        .query("INSERT INTO Categorias_Productos (id_categoria, nombre, descripcion, estado) VALUES (@id, @nombre, @descripcion, @estado)");
};
exports.createCategoria = createCategoria;
const updateCategoria = async (id, data) => {
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
        await request.query(`UPDATE Categorias_Productos SET ${updates.join(", ")} WHERE id_categoria = @id`);
    }
};
exports.updateCategoria = updateCategoria;
const deleteCategoria = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Categorias_Productos WHERE id_categoria = @id");
};
exports.deleteCategoria = deleteCategoria;
