import { pool } from "../../config/database";

const normalizeText = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getAllPermisos = async () => {
  const result = await pool.request().query("SELECT * FROM Permisos ORDER BY id_permiso");
  return result.recordset;
};

export const getPermisoById = async (id: number) => {
  const result = await pool.request().input("id", id).query("SELECT * FROM Permisos WHERE id_permiso = @id");
  return result.recordset[0];
};

export const createPermiso = async (data: any) => {
  const { nombre, descripcion } = data;
  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_permiso), 0) + 1 AS nextId FROM Permisos");
  const id = idResult.recordset[0].nextId;

  await pool.request()
    .input("id", id)
    .input("nombre", nombre)
    .input("descripcion", descripcion)
    .query("INSERT INTO Permisos (id_permiso, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");
};

export const findPermisoByNombre = async (nombre: string) => {
  const normalizedName = normalizeText(nombre);

  const result = await pool.request().query("SELECT * FROM Permisos");
  const existing = result.recordset.find((permiso: any) => {
    const permisoNombre = permiso.nombre?.toString?.() ?? '';
    const normalizedPermisoNombre = normalizeText(permisoNombre);
    return normalizedPermisoNombre === normalizedName;
  });

  return existing;
};

export const createPermisoIfNotExists = async (data: any) => {
  const existing = await findPermisoByNombre(data.nombre);
  if (existing) return existing;

  const idResult = await pool.request().query("SELECT ISNULL(MAX(id_permiso), 0) + 1 AS nextId FROM Permisos");
  const id = idResult.recordset[0].nextId;

  await pool.request()
    .input("id", id)
    .input("nombre", data.nombre)
    .input("descripcion", data.descripcion)
    .query("INSERT INTO Permisos (id_permiso, nombre, descripcion) VALUES (@id, @nombre, @descripcion)");

  return { id_permiso: id, nombre: data.nombre, descripcion: data.descripcion };
};

export const deletePermisosByIds = async (ids: number[]) => {
  if (!Array.isArray(ids) || ids.length === 0) return;

  const request = pool.request();
  const parameters = ids.map((id, idx) => {
    const key = `id${idx}`;
    request.input(key, id);
    return `@${key}`;
  });

  await request.query(`DELETE FROM Permisos WHERE id_permiso IN (${parameters.join(', ')})`);
};

export const updateRolPermisoId = async (oldPermisoId: number, newPermisoId: number) => {
  await pool.request()
    .input('oldPermisoId', oldPermisoId)
    .input('newPermisoId', newPermisoId)
    .query(`
      UPDATE rp
      SET id_permiso = @newPermisoId
      FROM Rol_Permiso rp
      LEFT JOIN Rol_Permiso target
        ON target.id_rol = rp.id_rol
        AND target.id_permiso = @newPermisoId
      WHERE rp.id_permiso = @oldPermisoId
        AND target.id_rol IS NULL;

      DELETE FROM Rol_Permiso WHERE id_permiso = @oldPermisoId;
    `);
};

export const updatePermiso = async (id: number, data: any) => {
  const { nombre, descripcion } = data;
  const updates = [];
  const request = pool.request().input("id", id);

  if (nombre !== undefined) {
    updates.push("nombre = @nombre");
    request.input("nombre", nombre);
  }
  if (descripcion !== undefined) {
    updates.push("descripcion = @descripcion");
    request.input("descripcion", descripcion);
  }

  if (updates.length > 0) {
    await request.query(`UPDATE Permisos SET ${updates.join(", ")} WHERE id_permiso = @id`);
  }
};

export const deletePermiso = async (id: number) => {
  await pool.request()
    .input("id", id)
    .query("DELETE FROM Permisos WHERE id_permiso = @id");
};
