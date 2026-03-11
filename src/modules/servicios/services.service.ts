import * as serviciosRepository from "./services.repository";

export const getServicios = async () => {
  return await serviciosRepository.getServicios();
};

export const createServicio = async (data: any) => {
  return await serviciosRepository.createServicio(data);
};