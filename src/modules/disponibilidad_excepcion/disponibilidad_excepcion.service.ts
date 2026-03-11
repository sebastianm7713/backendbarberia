import * as repository from "./disponibilidad_excepcion.repository";

export const getAllDisponibilidades = async () => await repository.getAllDisponibilidades();
export const getDisponibilidadById = async (id: number) => await repository.getDisponibilidadById(id);
export const createDisponibilidad = async (data: any) => {
  await repository.createDisponibilidad(data);
  return { message: "Disponibilidad creada correctamente" };
};
export const updateDisponibilidad = async (id: number, data: any) => {
  await repository.updateDisponibilidad(id, data);
  return { message: "Disponibilidad actualizada correctamente" };
};
export const deleteDisponibilidad = async (id: number) => {
  await repository.deleteDisponibilidad(id);
  return { message: "Disponibilidad eliminada correctamente" };
};