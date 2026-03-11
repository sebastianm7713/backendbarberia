import * as repository from "./consignaciones_proveedor.repository";

export const getAllConsignaciones = async () => await repository.getAllConsignaciones();
export const getConsignacionById = async (id: number) => await repository.getConsignacionById(id);
export const createConsignacion = async (data: any) => {
  await repository.createConsignacion(data);
  return { message: "Consignacion creada correctamente" };
};
export const updateConsignacion = async (id: number, data: any) => {
  await repository.updateConsignacion(id, data);
  return { message: "Consignacion actualizada correctamente" };
};
export const deleteConsignacion = async (id: number) => {
  await repository.deleteConsignacion(id);
  return { message: "Consignacion eliminada correctamente" };
};