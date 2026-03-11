import * as repository from "./barberos.repository";

export const getAllBarberos = async () => {
  return await repository.getAllBarberos();
};

export const getBarberoById = async (id: number) => {
  return await repository.getBarberoById(id);
};

export const createBarbero = async (data: any) => {
  await repository.createBarbero(data);
  return { message: "Barbero creado correctamente" };
};

export const updateBarbero = async (id: number, data: any) => {
  await repository.updateBarbero(id, data);
  return { message: "Barbero actualizado correctamente" };
};

export const deleteBarbero = async (id: number) => {
  await repository.deleteBarbero(id);
  return { message: "Barbero eliminado correctamente" };
};