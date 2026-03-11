import * as repository from "./clientes.repository";

export const getAllClientes = async () => {
  return await repository.getAllClientes();
};

export const getClienteById = async (id_cliente: number) => {
  return await repository.getClienteById(id_cliente);
};

export const createCliente = async (data: any) => {
  const id = await repository.createCliente(data);
  return { message: "Cliente creado correctamente", id_cliente: id };
};

export const updateCliente = async (id_cliente: number, data: any) => {
  await repository.updateCliente(id_cliente, data);
  return { message: "Cliente actualizado correctamente" };
};

export const deleteCliente = async (id_cliente: number) => {
  await repository.deleteCliente(id_cliente);
  return { message: "Cliente eliminado correctamente" };
};