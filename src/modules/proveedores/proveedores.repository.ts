import { pool } from "../../config/database";

export const getAllProveedores = async () => {
  const result = await pool.request().query(`
    SELECT * FROM Proveedores ORDER BY nombre
  `);
  return result.recordset;
};

export const getProveedorById = async (id_proveedor: number) => {
  const result = await pool.request()
    .input("id_proveedor", id_proveedor)
    .query(`
      SELECT * FROM Proveedores WHERE id_proveedor = @id_proveedor
    `);
  return result.recordset[0] || null;
};

export const createProveedor = async (data: any) => {
  const { nombre, contacto, telefono, email, direccion } = data;

  const idResult = await pool.request().query(`
    SELECT ISNULL(MAX(id_proveedor), 0) + 1 AS nextId FROM Proveedores
  `);
  const id_proveedor = idResult.recordset[0].nextId;

  await pool.request()
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

export const updateProveedor = async (id_proveedor: number, data: any) => {
  const { nombre, contacto, telefono, email, direccion } = data;

  let query = "UPDATE Proveedores SET ";
  const params: string[] = [];
  const inputs: any[] = [];

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

  const request = pool.request();
  inputs.forEach(input => request.input(input.name, input.value));
  request.input("id_proveedor", id_proveedor);

  await request.query(query);
};

export const deleteProveedor = async (id_proveedor: number) => {
  await pool.request()
    .input("id_proveedor", id_proveedor)
    .query("DELETE FROM Proveedores WHERE id_proveedor = @id_proveedor");
};