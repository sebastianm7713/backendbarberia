import * as repository from "./permisos.repository";

export const getAllPermisos = async () => await repository.getAllPermisos();
export const getPermisoById = async (id: number) => await repository.getPermisoById(id);
export const createPermiso = async (data: any) => {
  await repository.createPermiso(data);
  return { message: "Permiso creado correctamente" };
};
export const updatePermiso = async (id: number, data: any) => {
  await repository.updatePermiso(id, data);
  return { message: "Permiso actualizado correctamente" };
};
export const deletePermiso = async (id: number) => {
  await repository.deletePermiso(id);
  return { message: "Permiso eliminado correctamente" };
};