import api from "@/api/axios";
import type { Page } from "@/types/page";
import type { PageableParams } from "@/types/pageableParams";
import type { Classroom } from "@/types/classroom";

const classroomService = {
  getAll: async (
    pageable?: PageableParams
  ): Promise<Page<Classroom>> => {
    const response = await api.get<Page<Classroom>>("/turma", {
      params: pageable, // automaticamente converte { page: 1, size: 10 } => ?page=1&size=10
    });
    return response.data;
  },

  getById: async (id: string): Promise<Classroom> => {
    const response = await api.get(`/turma/${id}`);
    return response.data;
  },

  insert: async (name: string): Promise<Classroom> => {
    const response = await api.post(`/turma`, {
      nome: name,
    });
    return response.data;
  },

  update: async (id: string, name: string): Promise<Classroom> => {
    const response = await api.put(`/turma/${id}`, {
      nome: name,
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> =>
    await api.delete(`/turma/${id}`),
};

export default classroomService;
