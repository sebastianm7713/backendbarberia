import { pool } from "../../config/database";

export const getUsuarios = async () => {
  const result = await pool.request().query(`
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

export const getUsuarioById = async (id: number) => {
  const result = await pool.request()
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

export const getUsuarioByEmail = async (email: string) => {
  const result = await pool.request()
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

export const crearUsuario = async (data: any) => {
  const { id_rol, id_tipo_documento, numero_documento, nombre, email, telefono, direccion, contrasena, img } = data;
  
  const idResult = await pool.request()
    .query("SELECT ISNULL(MAX(id_usuario), 0) + 1 AS nextId FROM Usuarios");
  const id_usuario = idResult.recordset[0].nextId;

  await pool
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

export const updateUsuario = async (id: number, data: any) => {
  const { nombre, email, telefono, direccion, img } = data;
  let query = "UPDATE Usuarios SET ";
  const request = pool.request().input("id", id);
  
  const updates: string[] = [];
  
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

  if (updates.length === 0) return;

  query += updates.join(", ") + " WHERE id_usuario = @id";
  await request.query(query);
};

export const deleteUsuario = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Usuarios WHERE id_usuario = @id");
};