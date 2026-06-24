// ===== AUTH.REPOSITORY.TS (CORREGIDO) =====
// Reemplaza el archivo auth.repository.ts en tu backend con esto

import { pool } from "../../config/database";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email: string) => {
  const result = await pool.request()
    .input("email", email)
    .query("SELECT id_usuario, nombre, email, contrasena as password, id_rol as rol_id, img, telefono, direccion, estado FROM usuarios WHERE email = @email");

  return result.recordset[0];
};

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // ✅ AHORA INCLUYE img EN EL INSERT
  const result = await pool
    .request()
    .input("nombre", data.nombre)
    .input("email", data.email)
    .input("contrasena", hashedPassword)
    .input("id_rol", data.id_rol)
    .input("id_tipo_documento", data.id_tipo_documento || null)
    .input("numero_documento", data.numero_documento || null)
    .input("telefono", data.telefono || null)
    .input("direccion", data.direccion || null)
    .input("img", data.img || null)  // ✅ NUEVO: agregar img
    .query(`
      INSERT INTO usuarios (nombre, email, contrasena, id_rol, id_tipo_documento, numero_documento, telefono, direccion, img)
      OUTPUT INSERTED.id_usuario
      VALUES (@nombre, @email, @contrasena, @id_rol, @id_tipo_documento, @numero_documento, @telefono, @direccion, @img)
    `);

  const id_usuario = result.recordset[0].id_usuario;

  // If registering as client (role 3), create cliente record
  if (data.id_rol === 3) {
    await pool.request()
      .input("id_usuario", id_usuario)
      .query(`
        INSERT INTO Clientes (id_usuario)
        VALUES (@id_usuario)
      `);
  }

  return { id_usuario };
};

export const createPasswordResetToken = async (id_usuario: number, token: string, expiresAt: Date) => {
  await pool.request()
    .input('id_usuario', id_usuario)
    .input('token', token)
    .input('expires_at', expiresAt)
    .query(`
      INSERT INTO PasswordResetTokens (id_usuario, token, expires_at, used)
      VALUES (@id_usuario, @token, @expires_at, 0)
    `);
};

export const findResetToken = async (token: string) => {
  const result = await pool.request()
    .input('token', token)
    .query(`
      SELECT id_usuario, token, expires_at, used
      FROM PasswordResetTokens
      WHERE token = @token
    `);
  return result.recordset[0];
};

export const markResetTokenUsed = async (token: string) => {
  await pool.request()
    .input('token', token)
    .query(`
      UPDATE PasswordResetTokens SET used = 1 WHERE token = @token
    `);
};

export const updatePassword = async (id_usuario: number, contrasena: string) => {
  await pool.request()
    .input('id_usuario', id_usuario)
    .input('contrasena', contrasena)
    .query(`
      UPDATE usuarios SET contrasena = @contrasena WHERE id_usuario = @id_usuario
    `);
};

// devuelve array de nombres de permisos asociados a un rol
export const getPermisosByRol = async (rolId: number) => {
  const result = await pool.request()
    .input("rol", rolId)
    .query(`
      SELECT p.nombre
      FROM Rol_Permiso rp
      JOIN Permisos p ON rp.id_permiso = p.id_permiso
      WHERE rp.id_rol = @rol
    `);
  return result.recordset.map((r: any) => r.nombre);
};

// obtiene el nombre del rol por su ID
export const getRolNameById = async (rolId: number) => {
  const result = await pool.request()
    .input("rol_id", rolId)
    .query(`
      SELECT nombre
      FROM Roles
      WHERE id_rol = @rol_id
    `);
  return result.recordset[0]?.nombre || null;
};
