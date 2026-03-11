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
    const { nombre, contacto, telefono, email, direccion } = data;
    const idResult = await database_1.pool.request().query(`
    SELECT ISNULL(MAX(id_proveedor), 0) + 1 AS nextId FROM Proveedores
  `);
    const id_proveedor = idResult.recordset[0].nextId;
    await database_1.pool.request()
        .input("id_proveedor", id_proveedor)
        .input("nombre", nombre)
        .input("contacto", contacto || null)
        .input("telefono", telefono || null)
        .input("email", email || null)
        .input("direccion", direccion || null)
        .query(`
      INSERT INTO Proveedores (id_proveedor, nombre, contacto, telefono, email, direccion)
      VALUES (@id_proveedor, @nombre, @contacto, @telefono, @email, @direccion)
    `);
    return id_proveedor;
};
exports.createProveedor = createProveedor;
const updateProveedor = async (id_proveedor, data) => {
    const { nombre, contacto, telefono, email, direccion } = data;
    let query = "UPDATE Proveedores SET ";
    const params = [];
    const inputs = [];
    if (nombre !== undefined) {
        params.push("nombre = @nombre");
        inputs.push({ name: "nombre", value: nombre });
    }
    if (contacto !== undefined) {
        params.push("contacto = @contacto");
        inputs.push({ name: "contacto", value: contacto });
    }
    if (telefono !== undefined) {
        params.push("telefono = @telefono");
        inputs.push({ name: "telefono", value: telefono });
    }
    if (email !== undefined) {
        params.push("email = @email");
        inputs.push({ name: "email", value: email });
    }
    if (direccion !== undefined) {
        params.push("direccion = @direccion");
        inputs.push({ name: "direccion", value: direccion });
    }
    if (params.length === 0) {
        throw new Error("No fields to update");
    }
    query += params.join(", ") + " WHERE id_proveedor = @id_proveedor";
    const request = database_1.pool.request();
    inputs.forEach(input => request.input(input.name, input.value));
    request.input("id_proveedor", id_proveedor);
    await request.query(query);
};
exports.updateProveedor = updateProveedor;
const deleteProveedor = async (id_proveedor) => {
    await database_1.pool.request()
        .input("id_proveedor", id_proveedor)
        .query("DELETE FROM Proveedores WHERE id_proveedor = @id_proveedor");
};
exports.deleteProveedor = deleteProveedor;
