import api from "@/api/axios";
import type { Attendance } from "@/types/attendance";
import { formatDateOnly } from "@/util/date";

const attendanceService = {
  getAllAttendanceByClassroomAndDate: async (
    classroomId: string,
    attendanceDate: string | null
  ): Promise<Attendance[]> => {
    const response = await api.get(`/presenca/turma/${classroomId}`, {
      params: { data_presenca: attendanceDate },
    });
    return response.data;
  },

  insertAttendanceByClassroomAndDate: async (
    classroomId: string,
    attendanceDate: string | null,
    attendances: Attendance[]
  ): Promise<Attendance[]> => {
    const response = await api.post(
      `/presenca/turma/${classroomId}`,
      attendances,
      {
        params: { data_presenca: attendanceDate },
      }
    );
    return response.data;
  },

  updateAttendanceByClassroomAndDate: async (
    classroomId: string,
    attendanceDate: string | null,
    attendances: Attendance[]
  ): Promise<Attendance[]> => {
    const response = await api.put(
      `/presenca/turma/${classroomId}`,
      attendances,
      {
        params: { data_presenca: attendanceDate },
      }
    );
    return response.data;
  },

  saveAll: async (attendances: Attendance[]) => {
    const { data } = await api.post<Attendance[]>(
      "/attendances",
      attendances
    );
    return data;
  },

  getAttendancesReport: async (
    classroomId: string,
    startDate: Date,
    endDate: Date
  ) => {
    const { data } = await api.get(`/attendances/turma/${classroomId}/relatorio`, {
      params: {
        dataInicial: formatDateOnly(startDate),
        dataFinal: formatDateOnly(endDate),
      },
      responseType: "blob",
    });
    return data;
  },
};

export default attendanceService;
