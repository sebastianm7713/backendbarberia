import * as repository from "./roles.repository";

export const getAllRoles = async () => {
  return await repository.getAllRoles();
};

export const getRolById = async (id: number) => {
  return await repository.getRolById(id);
};

export const createRol = async (data: any) => {
  await repository.createRol(data);
  return { message: "Rol creado correctamente" };
};

export const updateRol = async (id: number, data: any) => {
  await repository.updateRol(id, data);
  return { message: "Rol actualizado correctamente" };
};

export const deleteRol = async (id: number) => {
  await repository.deleteRol(id);
  return { message: "Rol eliminado correctamente" };
};