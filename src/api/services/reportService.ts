import api from "../axios";
import { API_ENDPOINTS } from "@/util/constants";
import { formatDateOnly } from "@/util/date";

const getAttendanceReport = async (classroomId: string, startDate: Date, endDate: Date) => {
    const { data } = await api.get(API_ENDPOINTS.REPORTS.ATTENDANCE_BY_CLASSROOM(classroomId), {
        params: {
            dataInicial: formatDateOnly(startDate),
            dataFinal: formatDateOnly(endDate),
        },
        responseType: "blob",
    });
    return data;
};

const getStudentsReport = async (classroomId: string, startDate: Date, endDate: Date) => {
    const { data } = await api.get(API_ENDPOINTS.REPORTS.STUDENTS_BY_CLASSROOM(classroomId), {
        params: {
            dataInicial: formatDateOnly(startDate),
            dataFinal: formatDateOnly(endDate),
        },
        responseType: "blob",
    });
    return data;
};

export const reportService = {
    getAttendanceReport,
    getStudentsReport,
};
