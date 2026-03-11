import * as repository from "./categorias_productos.repository";

export const getAllCategorias = async () => await repository.getAllCategorias();
export const getCategoriaById = async (id: number) => await repository.getCategoriaById(id);
export const createCategoria = async (data: any) => {
  await repository.createCategoria(data);
  return { message: "Categoria creada correctamente" };
};
export const updateCategoria = async (id: number, data: any) => {
  await repository.updateCategoria(id, data);
  return { message: "Categoria actualizada correctamente" };
};
export const deleteCategoria = async (id: number) => {
  await repository.deleteCategoria(id);
  return { message: "Categoria eliminada correctamente" };
};