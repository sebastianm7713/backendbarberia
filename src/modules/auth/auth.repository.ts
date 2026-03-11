import { pool } from "../../config/database";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email: string) => {
  const result = await pool.request()
    .input("email", email)
    .query("SELECT id_usuario, nombre, email, contrasena as password, id_rol as rol_id FROM usuarios WHERE email = @email");

  return result.recordset[0];
};

export const createUser = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await pool.request()
    .input("nombre", data.nombre)
    .input("email", data.email)
    .input("contrasena", hashedPassword)
    .input("id_rol", data.id_rol)
    .query(`
      INSERT INTO usuarios (nombre, email, contrasena, id_rol)
      VALUES (@nombre, @email, @contrasena, @id_rol)
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