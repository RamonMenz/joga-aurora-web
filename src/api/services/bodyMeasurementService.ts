import api from "@/api/axios";
import { API_ENDPOINTS } from "@/util/constants";
import type { Page } from "@/types/page";
import type { PageableParams } from "@/types/pageableParams";
import type { BodyMeasurement } from "@/types/bodyMeasurement";

const bodyMeasurementService = {
  getAll: async (pageable?: PageableParams): Promise<Page<BodyMeasurement>> => {
    const response = await api.get<Page<BodyMeasurement>>(API_ENDPOINTS.BODY_MEASUREMENTS.BASE, {
      params: pageable, // automaticamente converte { page: 1, size: 10 } => ?page=1&size=10
    });
    return response.data;
  },

  getById: async (id: string): Promise<BodyMeasurement> => {
    const response = await api.get(API_ENDPOINTS.BODY_MEASUREMENTS.BY_ID(id));
    return response.data;
  },

  insert: async (
    studentId: string,
    collectionDate: Date,
    waist: number,
    weight: number,
    height: number
  ): Promise<BodyMeasurement> => {
    const response = await api.post(API_ENDPOINTS.BODY_MEASUREMENTS.BASE, {
      estudante: { id: studentId },
      data_coleta: collectionDate,
      cintura: waist,
      peso: weight,
      estatura: height,
    });
    return response.data;
  },

  update: async (
    id: string,
    collectionDate: Date,
    waist: number,
    weight: number,
    height: number
  ): Promise<BodyMeasurement> => {
    const response = await api.put(API_ENDPOINTS.BODY_MEASUREMENTS.BY_ID(id), {
      data_coleta: collectionDate,
      cintura: waist,
      peso: weight,
      estatura: height,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> =>
    await api.delete(API_ENDPOINTS.BODY_MEASUREMENTS.BY_ID(id)),
};

export default bodyMeasurementService;
