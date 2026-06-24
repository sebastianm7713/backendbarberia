import * as repository from "./roles.repository";

export const getAllRoles = async () => {
  return await repository.getAllRoles();
};

export const getRolById = async (id: number) => {
  return await repository.getRolById(id);
};

export const createRol = async (data: any) => {
  console.log('Service createRol called with:', data);
  const result = await repository.createRol(data);
  console.log('Repository returned:', result);
  return result;
};

export const updateRol = async (id: number, data: any) => {
  const result = await repository.updateRol(id, data);
  return result;
};

export const updateRolEstado = async (id: number, estado: string) => {
  const result = await repository.updateRol(id, { estado });
  return result;
};

export const deleteRol = async (id: number) => {
  await repository.deleteRol(id);
  return { message: "Rol eliminado correctamente" };
};