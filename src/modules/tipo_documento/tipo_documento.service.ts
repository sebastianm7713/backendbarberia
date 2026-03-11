import * as repository from "./tipo_documento.repository";

export const getAllTiposDocumento = async () => await repository.getAllTiposDocumento();
export const getTipoDocumentoById = async (id: number) => await repository.getTipoDocumentoById(id);
export const createTipoDocumento = async (data: any) => {
  await repository.createTipoDocumento(data);
  return { message: "Tipo de documento creado correctamente" };
};
export const updateTipoDocumento = async (id: number, data: any) => {
  await repository.updateTipoDocumento(id, data);
  return { message: "Tipo de documento actualizado correctamente" };
};
export const deleteTipoDocumento = async (id: number) => {
  await repository.deleteTipoDocumento(id);
  return { message: "Tipo de documento eliminado correctamente" };
};