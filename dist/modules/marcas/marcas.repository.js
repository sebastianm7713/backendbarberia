"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMarca = exports.updateMarca = exports.createMarca = exports.getMarcaById = exports.getAllMarcas = void 0;
const database_1 = require("../../config/database");
const getAllMarcas = async () => {
    const result = await database_1.pool.request().query("SELECT * FROM Marcas ORDER BY id_marca");
    return result.recordset;
};
exports.getAllMarcas = getAllMarcas;
const getMarcaById = async (id) => {
    const result = await database_1.pool.request().input("id", id).query("SELECT * FROM Marcas WHERE id_marca = @id");
    return result.recordset[0];
};
exports.getMarcaById = getMarcaById;
const createMarca = async (data) => {
    const { nombre } = data;
    const idResult = await database_1.pool.request().query("SELECT ISNULL(MAX(id_marca), 0) + 1 AS nextId FROM Marcas");
    const id = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id", id)
        .input("nombre", nombre)
        .query("INSERT INTO Marcas (id_marca, nombre) VALUES (@id, @nombre)");
};
exports.createMarca = createMarca;
const updateMarca = async (id, data) => {
    const { nombre } = data;
    if (nombre !== undefined) {
        await database_1.pool.request()
            .input("id", id)
            .input("nombre", nombre)
            .query("UPDATE Marcas SET nombre = @nombre WHERE id_marca = @id");
    }
};
exports.updateMarca = updateMarca;
const deleteMarca = async (id) => {
    await database_1.pool.request()
        .input("id", id)
        .query("DELETE FROM Marcas WHERE id_marca = @id");
};
exports.deleteMarca = deleteMarca;
