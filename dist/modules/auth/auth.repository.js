"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermisosByRol = exports.createUser = exports.findUserByEmail = void 0;
const database_1 = require("../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const findUserByEmail = async (email) => {
    const result = await database_1.pool.request()
        .input("email", email)
        .query("SELECT id_usuario, nombre, email, contrasena as password, id_rol as rol_id FROM usuarios WHERE email = @email");
    return result.recordset[0];
};
exports.findUserByEmail = findUserByEmail;
const createUser = async (data) => {
    const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
    await database_1.pool.request()
        .input("nombre", data.nombre)
        .input("email", data.email)
        .input("contrasena", hashedPassword)
        .input("id_rol", data.id_rol)
        .query(`
      INSERT INTO usuarios (nombre, email, contrasena, id_rol)
      VALUES (@nombre, @email, @contrasena, @id_rol)
    `);
};
exports.createUser = createUser;
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
