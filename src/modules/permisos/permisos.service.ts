import { pool } from "../../config/database";
import * as repository from "./permisos.repository";
import { DEFAULT_PERMISSION_STRUCTURE, defaultPermissionDefinitions } from "./permisos.constants";

const normalizeText = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const findProcessBySubmodule = (submoduleLabel: string) => {
  const normalized = normalizeText(submoduleLabel);
  return DEFAULT_PERMISSION_STRUCTURE.find((process) =>
    process.submodules.some((submodule) => normalizeText(submodule.label) === normalized)
  );
};

export const getAllPermisos = async () => await repository.getAllPermisos();
export const getPermisoById = async (id: number) => await repository.getPermisoById(id);
export const createPermiso = async (data: any) => {
  await repository.createPermiso(data);
  return { message: "Permiso creado correctamente" };
};

export const cleanupDuplicatePermisos = async () => {
  const permisos = await repository.getAllPermisos();
  const grouped = permisos.reduce((acc: Record<string, any[]>, permiso: any) => {
    const key = normalizeText(permiso.nombre ?? '');
    if (!acc[key]) acc[key] = [];
    acc[key].push(permiso);
    return acc;
  }, {});

  const duplicateGroups = Object.values(grouped).filter((group) => group.length > 1);
  if (duplicateGroups.length === 0) {
    return { cleaned: 0, duplicateGroups: 0 };
  }

  const transaction = pool.transaction();
  await transaction.begin();
  try {
    let cleaned = 0;

    for (const group of duplicateGroups) {
      const [canonical, ...duplicates] = group.sort((a, b) => a.id_permiso - b.id_permiso);
      for (const duplicate of duplicates) {
        await transaction.request()
          .input('canonicalId', canonical.id_permiso)
          .input('duplicateId', duplicate.id_permiso)
          .query(`
            UPDATE rp
            SET id_permiso = @canonicalId
            FROM Rol_Permiso rp
            LEFT JOIN Rol_Permiso target
              ON target.id_rol = rp.id_rol
              AND target.id_permiso = @canonicalId
            WHERE rp.id_permiso = @duplicateId
              AND target.id_rol IS NULL;

            DELETE FROM Rol_Permiso WHERE id_permiso = @duplicateId;
          `);

        await transaction.request()
          .input('duplicateId', duplicate.id_permiso)
          .query(`DELETE FROM Permisos WHERE id_permiso = @duplicateId`);

        cleaned += 1;
      }
    }

    await transaction.commit();
    return { cleaned, duplicateGroups: duplicateGroups.length };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getPermisosTree = async () => {
  const permisos = await repository.getAllPermisos();

  const tree: Record<string, { processLabel: string; submodules: any[] }> = {};
  const regex = /^(?:Gesti[oó]n de\s+)?([^-]+?)\s*-\s*(Ver|Crear|Editar|Eliminar|Cambiar Estado|Anular|Detalle)$/i;

  permisos.forEach((permiso: any) => {
    const match = permiso.nombre.match(regex);
    if (!match) {
      const moduleKey = 'Otros';
      if (!tree[moduleKey]) tree[moduleKey] = { processLabel: moduleKey, submodules: [{ label: moduleKey, acciones: [] }] };
      tree[moduleKey].submodules[0].acciones.push({
        id_permiso: permiso.id_permiso,
        action: 'Ver',
        nombre: permiso.nombre,
        descripcion: permiso.descripcion,
      });
      return;
    }

    const submoduleLabel = match[1].trim();
    const action = match[2];
    const process = findProcessBySubmodule(submoduleLabel);
    const processLabel = process?.processLabel || submoduleLabel;
    const submoduleKey = submoduleLabel;

    if (!tree[processLabel]) {
      tree[processLabel] = { processLabel, submodules: [] };
    }

    let submodule = tree[processLabel].submodules.find((item) => item.label === submoduleKey);
    if (!submodule) {
      submodule = { label: submoduleKey, acciones: [] };
      tree[processLabel].submodules.push(submodule);
    }

    submodule.acciones.push({
      id_permiso: permiso.id_permiso,
      action,
      nombre: permiso.nombre,
      descripcion: permiso.descripcion,
    });
  });

  const ordered = [...DEFAULT_PERMISSION_STRUCTURE.map((process) => process.processLabel)];
  return Object.values(tree)
    .sort((a, b) => {
      const aIndex = ordered.indexOf(a.processLabel);
      const bIndex = ordered.indexOf(b.processLabel);
      if (aIndex === -1 && bIndex === -1) return a.processLabel.localeCompare(b.processLabel, 'es');
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
};

export const seedDefaultPermisos = async () => {
  await cleanupDuplicatePermisos();

  const inserted: any[] = [];
  for (const permiso of defaultPermissionDefinitions) {
    const row = await repository.createPermisoIfNotExists(permiso);
    inserted.push(row);
  }
  return inserted;
};

export const updatePermiso = async (id: number, data: any) => {
  await repository.updatePermiso(id, data);
  return { message: "Permiso actualizado correctamente" };
};

export const deletePermiso = async (id: number) => {
  await repository.deletePermiso(id);
  return { message: "Permiso eliminado correctamente" };
};
