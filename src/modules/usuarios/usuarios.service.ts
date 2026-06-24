import * as repository from "./usuarios.repository";

export const getUsuarios = async () => {
  return await repository.getUsuarios();
};

export const getUsuarioById = async (id: number) => {
  return await repository.getUsuarioById(id);
};

export const crearUsuario = async (data: any) => {
  return await repository.crearUsuario(data);
};

export const updateUsuario = async (id: number, data: any) => {
  return await repository.updateUsuario(id, data);
};

export const deleteUsuario = async (id: number) => {
  return await repository.deleteUsuario(id);
};