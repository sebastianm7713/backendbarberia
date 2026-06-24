"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProveedor = exports.updateProveedor = exports.createProveedor = exports.getProveedorById = exports.getAllProveedores = void 0;
const database_1 = require("../../config/database");
const getAllProveedores = async () => {
    const result = await database_1.pool.request().query(`
    SELECT * FROM Proveedores ORDER BY nombre
  `);
    return result.recordset;
};
exports.getAllProveedores = getAllProveedores;
const getProveedorById = async (id_proveedor) => {
    const result = await database_1.pool.request()
        .input("id_proveedor", id_proveedor)
        .query(`
      SELECT * FROM Proveedores WHERE id_proveedor = @id_proveedor
    `);
    return result.recordset[0] || null;
};
exports.getProveedorById = getProveedorById;
const createProveedor = async (data) => {
    const { id_marca, id_tipo_documento, numero_documento, nombre, representante, telefono, correo, nit, estado, } = data;
    const idResult = await database_1.pool.request().query(`
    SELECT ISNULL(MAX(id_proveedor), 0) + 1 AS nextId FROM Proveedores
  `);
    const id_proveedor = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id_proveedor", id_proveedor)
        .input("id_marca", id_marca || null)
        .input("id_tipo_documento", id_tipo_documento)
        .input("numero_documento", numero_documento)
        .input("nombre", nombre)
        .input("representante", representante || null)
        .input("telefono", telefono || null)
        .input("correo", correo || null)
        .input("nit", nit || null)
        .input("estado", estado || 'Activo')
        .query(`
      INSERT INTO Proveedores 
      (id_proveedor, id_marca, id_tipo_documento, numero_documento, nombre, representante, telefono, correo, nit, estado)
      VALUES 
      (@id_proveedor, @id_marca, @id_tipo_documento, @numero_documento, @nombre, @representante, @telefono, @correo, @nit, @estado)
    `);
    return id_proveedor;
};
exports.createProveedor = createProveedor;
const updateProveedor = async (id_proveedor, data) => {
    const { id_marca, id_tipo_documento, numero_documento, nombre, representante, telefono, correo, nit, estado, } = data;
    const request = database_1.pool.request().input("id_proveedor", id_proveedor);
    const updates = [];
    if (id_marca !== undefined) {
        updates.push("id_marca = @id_marca");
        request.input("id_marca", id_marca);
    }
    if (id_tipo_documento !== undefined) {
        updates.push("id_tipo_documento = @id_tipo_documento");
        request.input("id_tipo_documento", id_tipo_documento);
    }
    if (numero_documento !== undefined) {
        updates.push("numero_documento = @numero_documento");
        request.input("numero_documento", numero_documento);
    }
    if (nombre !== undefined) {
        updates.push("nombre = @nombre");
        request.input("nombre", nombre);
    }
    if (representante !== undefined) {
        updates.push("representante = @representante");
        request.input("representante", representante);
    }
    if (telefono !== undefined) {
        updates.push("telefono = @telefono");
        request.input("telefono", telefono);
    }
    if (correo !== undefined) {
        updates.push("correo = @correo");
        request.input("correo", correo);
    }
    if (nit !== undefined) {
        updates.push("nit = @nit");
        request.input("nit", nit);
    }
    if (estado !== undefined) {
        updates.push("estado = @estado");
        request.input("estado", estado);
    }
    if (updates.length === 0)
        return;
    const query = `UPDATE Proveedores SET ${updates.join(", ")} WHERE id_proveedor = @id_proveedor`;
    await request.query(query);
};
exports.updateProveedor = updateProveedor;
const deleteProveedor = async (id_proveedor) => {
    await database_1.pool.request()
        .input("id_proveedor", id_proveedor)
        .query("DELETE FROM Proveedores WHERE id_proveedor = @id_proveedor");
};
exports.deleteProveedor = deleteProveedor;
