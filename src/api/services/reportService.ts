import api from "../axios";

const getAttendancesReport = async (classroomId: string, startDate: Date, endDate: Date) => {
    const { data } = await api.get(`/presenca/turma/${classroomId}/relatorio`, {
        params: {
            dataInicial: startDate.toISOString().split('T')[0],
            dataFinal: endDate.toISOString().split('T')[0],
        },
        responseType: 'blob',
    });
    return data;
};

export const reportService = {
    getAttendancesReport,
};
