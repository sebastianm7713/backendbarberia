import * as repository from "./proveedores.repository";

export const getAllProveedores = async () => {
  return await repository.getAllProveedores();
};

export const getProveedorById = async (id_proveedor: number) => {
  return await repository.getProveedorById(id_proveedor);
};

export const createProveedor = async (data: any) => {
  const id = await repository.createProveedor(data);
  return { message: "Proveedor creado correctamente", id_proveedor: id };
};

export const updateProveedor = async (id_proveedor: number, data: any) => {
  await repository.updateProveedor(id_proveedor, data);
  return { message: "Proveedor actualizado correctamente" };
};

export const deleteProveedor = async (id_proveedor: number) => {
  await repository.deleteProveedor(id_proveedor);
  return { message: "Proveedor eliminado correctamente" };
};