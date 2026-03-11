import * as repository from "./alquiler_silla.repository";

export const getAllAlquileres = async () => await repository.getAllAlquileres();
export const getAlquilerById = async (id: number) => await repository.getAlquilerById(id);
export const createAlquiler = async (data: any) => {
  await repository.createAlquiler(data);
  return { message: "Alquiler creado correctamente" };
};
export const updateAlquiler = async (id: number, data: any) => {
  await repository.updateAlquiler(id, data);
  return { message: "Alquiler actualizado correctamente" };
};
export const deleteAlquiler = async (id: number) => {
  await repository.deleteAlquiler(id);
  return { message: "Alquiler eliminado correctamente" };
};