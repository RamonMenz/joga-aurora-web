import api from "@/api/axios";
import { API_ENDPOINTS } from "@/util/constants";
import type { Page } from "@/types/page";
import type { PageableParams } from "@/types/pageableParams";
import type { PhysicalTest } from "@/types/physicalTest";

const physicalTestService = {
  getAll: async (pageable?: PageableParams): Promise<Page<PhysicalTest>> => {
    const response = await api.get<Page<PhysicalTest>>(API_ENDPOINTS.PHYSICAL_TESTS.BASE, {
      params: pageable,
    });
    return response.data;
  },

  getById: async (id: string): Promise<PhysicalTest> => {
    const response = await api.get(API_ENDPOINTS.PHYSICAL_TESTS.BY_ID(id));
    return response.data;
  },

  insert: async (
    studentId: string,
    collectionDate: Date,
    sixMinutesTest: number,
    flexTest: number,
    rmlTest: number,
    twentyMetersTest: number,
    throwTwoKgTest: number
  ): Promise<PhysicalTest> => {
    const response = await api.post(API_ENDPOINTS.PHYSICAL_TESTS.BASE, {
      estudante: { id: studentId },
      data_coleta: collectionDate,
      teste_seis_minutos: sixMinutesTest,
      teste_flex: flexTest,
      teste_rml: rmlTest,
      teste_vinte_metros: twentyMetersTest,
      teste_arremesso_dois_quilos: throwTwoKgTest,
    });
    return response.data;
  },

  update: async (
    id: string,
    collectionDate: Date,
    sixMinutesTest: number,
    flexTest: number,
    rmlTest: number,
    twentyMetersTest: number,
    throwTwoKgTest: number
  ): Promise<PhysicalTest> => {
    const response = await api.put(API_ENDPOINTS.PHYSICAL_TESTS.BY_ID(id), {
      data_coleta: collectionDate,
      teste_seis_minutos: sixMinutesTest,
      teste_flex: flexTest,
      teste_rml: rmlTest,
      teste_vinte_metros: twentyMetersTest,
      teste_arremesso_dois_quilos: throwTwoKgTest,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> =>
    await api.delete(API_ENDPOINTS.PHYSICAL_TESTS.BY_ID(id)),
};

export default physicalTestService;
