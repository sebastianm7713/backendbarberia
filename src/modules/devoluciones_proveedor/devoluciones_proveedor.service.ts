import * as repository from "./devoluciones_proveedor.repository";

export const getAllDevoluciones = async () => await repository.getAllDevoluciones();
export const getDevolucionById = async (id: number) => await repository.getDevolucionById(id);
export const createDevolucion = async (data: any) => {
  await repository.createDevolucion(data);
  return { message: "Devolucion creada correctamente" };
};
export const updateDevolucion = async (id: number, data: any) => {
  await repository.updateDevolucion(id, data);
  return { message: "Devolucion actualizada correctamente" };
};
export const deleteDevolucion = async (id: number) => {
  await repository.deleteDevolucion(id);
  return { message: "Devolucion eliminada correctamente" };
};