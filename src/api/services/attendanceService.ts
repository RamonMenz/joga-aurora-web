import api from "@/api/axios";
import { API_ENDPOINTS } from "@/util/constants";
import type { Attendance } from "@/types/attendance";

const attendanceService = {
  getAllAttendanceByClassroomAndDate: async (
    classroomId: string,
    attendanceDate: string | null
  ): Promise<Attendance[]> => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.BY_CLASSROOM(classroomId), {
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
      API_ENDPOINTS.ATTENDANCE.BY_CLASSROOM(classroomId),
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
      API_ENDPOINTS.ATTENDANCE.BY_CLASSROOM(classroomId),
      attendances,
      {
        params: { data_presenca: attendanceDate },
      }
    );
    return response.data;
  },

  saveAll: async (attendances: Attendance[]) => {
    const { data } = await api.post<Attendance[]>(
      API_ENDPOINTS.ATTENDANCE.BASE,
      attendances
    );
    return data;
  },

};

export default attendanceService;
