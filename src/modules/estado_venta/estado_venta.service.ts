import * as repository from "./estado_venta.repository";

export const listarEstadosVenta = async () => {
  return await repository.getAllEstadosVenta();
};

export const obtenerEstadoVentaPorId = async (id: number) => {
  const estado = await repository.getEstadoVentaById(id);
  if (!estado) {
    throw new Error("Estado de venta no encontrado");
  }
  return estado;
};