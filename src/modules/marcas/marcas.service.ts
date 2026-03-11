import * as repository from "./marcas.repository";

export const getAllMarcas = async () => await repository.getAllMarcas();
export const getMarcaById = async (id: number) => await repository.getMarcaById(id);
export const createMarca = async (data: any) => {
  await repository.createMarca(data);
  return { message: "Marca creada correctamente" };
};
export const updateMarca = async (id: number, data: any) => {
  await repository.updateMarca(id, data);
  return { message: "Marca actualizada correctamente" };
};
export const deleteMarca = async (id: number) => {
  await repository.deleteMarca(id);
  return { message: "Marca eliminada correctamente" };
};