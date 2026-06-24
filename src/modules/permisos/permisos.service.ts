import * as repository from "./permisos.repository";
import { defaultPermissionDefinitions } from "./permisos.constants";

export const getAllPermisos = async () => await repository.getAllPermisos();
export const getPermisoById = async (id: number) => await repository.getPermisoById(id);
export const createPermiso = async (data: any) => {
  await repository.createPermiso(data);
  return { message: "Permiso creado correctamente" };
};
export const getPermisosTree = async () => {
  const permisos = await repository.getAllPermisos();
  const tree: Record<string, { module: string; permisos: any[] }> = {};
  // Aceptar tanto 'Gestión' como 'Gestion' (con/sin acento) y 'Dashboard'
  const regex = /^(Gesti[oó]n de [^-]+|Dashboard) - (Ver|Crear|Editar|Eliminar|Cambiar Estado)$/i;

  permisos.forEach((permiso: any) => {
    const match = permiso.nombre.match(regex);
    if (!match) {
      const moduleKey = "Otros";
      if (!tree[moduleKey]) {
        tree[moduleKey] = { module: moduleKey, permisos: [] };
      }
      tree[moduleKey].permisos.push({
        id_permiso: permiso.id_permiso,
        nombre: permiso.nombre,
        descripcion: permiso.descripcion
      });
      return;
    }

    const moduleLabel = match[1];
    const action = match[2];

    if (!tree[moduleLabel]) {
      tree[moduleLabel] = { module: moduleLabel, permisos: [] };
    }

    tree[moduleLabel].permisos.push({
      id_permiso: permiso.id_permiso,
      action,
      nombre: permiso.nombre,
      descripcion: permiso.descripcion
    });
  });

  return Object.values(tree);
};
export const seedDefaultPermisos = async () => {
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
