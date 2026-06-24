"use strict";
// ===== AUTH.REPOSITORY.TS (CORREGIDO) =====
// Reemplaza el archivo auth.repository.ts en tu backend con esto
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRolNameById = exports.getPermisosByRol = exports.updatePassword = exports.markResetTokenUsed = exports.findResetToken = exports.createPasswordResetToken = exports.createUser = exports.findUserByEmail = void 0;
const database_1 = require("../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const findUserByEmail = async (email) => {
    const result = await database_1.pool.request()
        .input("email", email)
        .query("SELECT id_usuario, nombre, email, contrasena as password, id_rol as rol_id, img, telefono, direccion, estado FROM usuarios WHERE email = @email");
    return result.recordset[0];
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (data) => {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    // ✅ AHORA INCLUYE img EN EL INSERT
    const result = await database_1.pool
        .request()
        .input("nombre", data.nombre)
        .input("email", data.email)
        .input("contrasena", hashedPassword)
        .input("id_rol", data.id_rol)
        .input("id_tipo_documento", data.id_tipo_documento || null)
        .input("numero_documento", data.numero_documento || null)
        .input("telefono", data.telefono || null)
        .input("direccion", data.direccion || null)
        .input("img", data.img || null) // ✅ NUEVO: agregar img
        .query(`
      INSERT INTO usuarios (nombre, email, contrasena, id_rol, id_tipo_documento, numero_documento, telefono, direccion, img)
      OUTPUT INSERTED.id_usuario
      VALUES (@nombre, @email, @contrasena, @id_rol, @id_tipo_documento, @numero_documento, @telefono, @direccion, @img)
    `);
    const id_usuario = result.recordset[0].id_usuario;
    // If registering as client (role 3), create cliente record
    if (data.id_rol === 3) {
        await database_1.pool.request()
            .input("id_usuario", id_usuario)
            .query(`
        INSERT INTO Clientes (id_usuario)
        VALUES (@id_usuario)
      `);
    }
    return { id_usuario };
};
exports.createUser = createUser;
const createPasswordResetToken = async (id_usuario, token, expiresAt) => {
    await database_1.pool.request()
        .input('id_usuario', id_usuario)
        .input('token', token)
        .input('expires_at', expiresAt)
        .query(`
      INSERT INTO PasswordResetTokens (id_usuario, token, expires_at, used)
      VALUES (@id_usuario, @token, @expires_at, 0)
    `);
};
exports.createPasswordResetToken = createPasswordResetToken;
const findResetToken = async (token) => {
    const result = await database_1.pool.request()
        .input('token', token)
        .query(`
      SELECT id_usuario, token, expires_at, used
      FROM PasswordResetTokens
      WHERE token = @token
    `);
    return result.recordset[0];
};
exports.findResetToken = findResetToken;
const markResetTokenUsed = async (token) => {
    await database_1.pool.request()
        .input('token', token)
        .query(`
      UPDATE PasswordResetTokens SET used = 1 WHERE token = @token
    `);
};
exports.markResetTokenUsed = markResetTokenUsed;
const updatePassword = async (id_usuario, contrasena) => {
    await database_1.pool.request()
        .input('id_usuario', id_usuario)
        .input('contrasena', contrasena)
        .query(`
      UPDATE usuarios SET contrasena = @contrasena WHERE id_usuario = @id_usuario
    `);
};
exports.updatePassword = updatePassword;
// devuelve array de nombres de permisos asociados a un rol
const getPermisosByRol = async (rolId) => {
    const result = await database_1.pool.request()
        .input("rol", rolId)
        .query(`
      SELECT p.nombre
      FROM Rol_Permiso rp
      JOIN Permisos p ON rp.id_permiso = p.id_permiso
      WHERE rp.id_rol = @rol
    `);
    return result.recordset.map((r) => r.nombre);
};
exports.getPermisosByRol = getPermisosByRol;
// obtiene el nombre del rol por su ID
const getRolNameById = async (rolId) => {
    const result = await database_1.pool.request()
        .input("rol_id", rolId)
        .query(`
      SELECT nombre
      FROM Roles
      WHERE id_rol = @rol_id
    `);
    return result.recordset[0]?.nombre || null;
};
exports.getRolNameById = getRolNameById;
