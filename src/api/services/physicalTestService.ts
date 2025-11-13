import api from "@/api/axios";
import type { Page } from "@/types/page";
import type { PageableParams } from "@/types/pageableParams";
import type { PhysicalTest } from "@/types/physicalTest";

const physicalTestService = {
  getAll: async (pageable?: PageableParams): Promise<Page<PhysicalTest>> => {
    const response = await api.get<Page<PhysicalTest>>("/teste-fisico", {
      params: pageable, // automaticamente converte { page: 1, size: 10 } => ?page=1&size=10
    });
    return response.data;
  },

  getById: async (id: string): Promise<PhysicalTest> => {
    const response = await api.get(`/teste-fisico/${id}`);
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
    const response = await api.post(`/teste-fisico`, {
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
    const response = await api.put(`/teste-fisico/${id}`, {
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
    await api.delete(`/teste-fisico/${id}`),
};

export default physicalTestService;
