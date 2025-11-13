import api from "@/api/axios";
import type { Page } from "@/types/page";
import type { PageableParams } from "@/types/pageableParams";
import type { Student } from "@/types/student";
import type { StudentFilter } from "@/types/studentFilter";
import { format as formatDate } from "date-fns";

const studentService = {
  getAll: async (
    pageable?: PageableParams,
    filter?: StudentFilter
  ): Promise<Page<Student>> => {
    // Ensure date parameters are formatted as yyyy-MM-dd for backend expectations
    const formattedFilter: Record<string, unknown> | undefined = filter
      ? {
          ...filter,
          ...(filter.data_nascimento_ini instanceof Date
            ? { data_nascimento_ini: formatDate(filter.data_nascimento_ini, "yyyy-MM-dd") }
            : {}),
          ...(filter.data_nascimento_fim instanceof Date
            ? { data_nascimento_fim: formatDate(filter.data_nascimento_fim, "yyyy-MM-dd") }
            : {}),
        }
      : undefined;

    const response = await api.get<Page<Student>>("/estudante", {
      params: {
        ...pageable,
        ...formattedFilter,
      },
    });
    // Some Spring controllers wrap pagination info under a `page` key.
    // Normalize the payload to the Page<T> interface expected by the UI.
    type RawPageEnvelope<T> = {
      content?: T[];
      totalElements?: number;
      totalPages?: number;
      size?: number;
      number?: number;
      first?: boolean;
      last?: boolean;
      empty?: boolean;
      page?: {
        totalElements?: number;
        totalPages?: number;
        size?: number;
        number?: number;
      };
    };
    const raw = response.data as unknown as RawPageEnvelope<Student>;
    const normalized: Page<Student> = {
      content: raw.content ?? [],
      totalElements:
        typeof raw.totalElements === "number"
          ? raw.totalElements
          : (raw.page?.totalElements as number) ?? 0,
      totalPages:
        typeof raw.totalPages === "number"
          ? raw.totalPages
          : (raw.page?.totalPages as number) ?? 1,
      size:
        typeof raw.size === "number"
          ? raw.size
          : (raw.page?.size as number) ?? (pageable?.size ?? 10),
      number:
        typeof raw.number === "number"
          ? raw.number
          : (raw.page?.number as number) ?? (pageable?.page ?? 0),
      first: typeof raw.first === "boolean" ? raw.first : undefined,
      last: typeof raw.last === "boolean" ? raw.last : undefined,
      empty:
        typeof raw.empty === "boolean"
          ? raw.empty
          : Array.isArray(raw.content)
            ? raw.content.length === 0
            : undefined,
    };
    return normalized;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get(`/estudante/${id}`);
    return response.data;
  },

  insert: async (
    name: string,
    birthDate: Date,
    gender: "M" | "F" | "N",
    classroomId: string
  ): Promise<Student> => {
    const response = await api.post(`/estudante`, {
      nome: name,
      data_nascimento: birthDate,
      genero: gender,
      turma: { id: classroomId },
    });
    return response.data;
  },

  update: async (
    id: string,
    name: string,
    birthDate: Date,
    gender: "M" | "F" | "N",
    classroomId: string
  ): Promise<Student> => {
    const response = await api.put(`/estudante/${id}`, {
      nome: name,
      data_nascimento: birthDate,
      genero: gender,
      turma: { id: classroomId },
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/estudante/${id}`);
  },
};

export default studentService;
