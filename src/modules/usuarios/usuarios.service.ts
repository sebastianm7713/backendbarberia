import * as repository from "./usuarios.repository";

export const getUsuarios = async () => {
  return await repository.getUsuarios();
};

export const crearUsuario = async (data: any) => {
  return await repository.crearUsuario(data);
};