import * as serviciosRepository from "./servicios.repository";

export const getServicios = async () => {
  const servicios = await serviciosRepository.getServicios();
  return servicios.map((servicio: any) => ({
    ...servicio,
    img: servicio.imagen ?? servicio.img ?? null,
  }));
};

export const createServicio = async (data: any) => {
  const { imagen, img } = data;
  const servicioCreado = await serviciosRepository.createServicio(data);
  const imagenValue = imagen ?? img;

  return {
    id_servicio: servicioCreado.id_servicio,
    ...data,
    imagen: imagenValue,
    img: imagenValue,
  }; 
};
export const getServicioById = async (id: number) => {
  const servicio = await serviciosRepository.getServicioById(id);
  if (!servicio) return servicio;
  const imagenValue = servicio.imagen ?? servicio.img ?? null;
  return { ...servicio, img: imagenValue };
};

export const updateServicio = async (id: number, data: any) => {
  const servicioActualizado = await serviciosRepository.updateServicio(id, data);
  if (!servicioActualizado) return servicioActualizado;
  const imagenValue = servicioActualizado.imagen ?? servicioActualizado.img ?? null;
  return { ...servicioActualizado, img: imagenValue };
};

export const deleteServicio = async (id: number) => {
  return await serviciosRepository.deleteServicio(id);
};