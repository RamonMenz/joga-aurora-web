import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/util/constants";
import attendanceService from "@/api/services/attendanceService";
import type { Attendance, AttendanceStatus } from "@/types/attendance";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Container } from "@/components/common/container";
import { useClassrooms } from "@/context/classroom/useClassroom";
import { StudentsTable } from "../components/student/students-table";
import { toBackendStatus } from "@/util/attendance";
import { ClassroomHeader } from "@/components/classroom/classroom-header";
import { EmptyState } from "@/components/common/empty-state";
import { PageLoader } from "@/components/common/page-loader";

/**
 * @description This is the main page component for displaying the details of a classroom.
 * It has been refactored to use a custom hook (useClassroom) and several sub-components
 * (ClassroomHeader, AttendanceTable, AddStudentDialog) to improve modularity and readability.
 * The core logic is now separated into smaller, more manageable pieces.
 */
export const ClassroomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { classroom, isClassroomLoading, attendances, updateAttendanceList, loadClassroom } = useClassrooms();
  const navigate = useNavigate();

  const [isAttendanceMode, setIsAttendanceMode] = useState(false);

  useEffect(() => {
    // load based on URL inside provider
    void loadClassroom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStartAttendance = () => {
    if (classroom) {
      if (classroom.chamada_feita) {
        // If attendance is already done, just enter attendance mode
        // The existing attendances are already loaded by the hook
      } else {
        // If not, start everyone as 'Presente'
        const newAttendances: Attendance[] = classroom.estudantes.map((student) => ({
          id: "",
            estudante: student,
            data_presenca: null,
            status: "Presente",
        }));
        updateAttendanceList(() => newAttendances);
      }
      setIsAttendanceMode(true);
    }
  };

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    updateAttendanceList((prev) => {
      const existingAttendance = prev.find((att) => att.estudante.id === studentId);
      if (existingAttendance) {
        return prev.map((att) => (att.estudante.id === studentId ? { ...att, status } : att));
      }
      const student = classroom?.estudantes.find((s) => s.id === studentId);
      if (student) {
        const newAttendance: Attendance = {
          id: "",
          estudante: student,
          data_presenca: new Date(),
          status,
        };
        return [...prev, newAttendance];
      }
      return prev;
    });
  };

  const handleSaveAttendance = async () => {
    if (!classroom || !attendances) return;

    const attendanceList = attendances.map(
      ({ id, estudante, status }) =>
        ({
          id,
          estudante,
          status: toBackendStatus(status as AttendanceStatus),
        } as Attendance)
    );

    try {
      await toast.promise(
        async () => {
          if (classroom.chamada_feita) {
            await attendanceService.updateAttendanceByClassroomAndDate(
              classroom.id,
              null,
              attendanceList
            );
            return "Presença atualizada com sucesso!";
          } else {
            await attendanceService.insertAttendanceByClassroomAndDate(
              classroom.id,
              null,
              attendanceList
            );
            return "Presença registrada com sucesso!";
          }
        },
        {
          loading: "Salvando presença...",
          success: (msg) => msg,
          error: "Erro ao salvar presença.",
        }
      );
      setIsAttendanceMode(false);
      await loadClassroom();
    } catch (error) {
      console.error("Erro ao salvar presença:", error);
    }
  };

  const handleRowClick = (studentId: string) => {
    if (!isAttendanceMode) {
      navigate(ROUTES.STUDENT_DETAILS(studentId));
    }
  };

  if (isClassroomLoading) {
    return <PageLoader message="Carregando turma..." />;
  }

  if (!classroom) {
    return (
      <Container>
        <EmptyState
          title="Turma não encontrada"
          description="A turma que você procura não existe ou foi removida."
        />
      </Container>
    );
  }

  return (
    <Container>
      <Card className="w-full h-full flex flex-col">
        <ClassroomHeader
          isAttendanceMode={isAttendanceMode}
          onStartAttendance={handleStartAttendance}
          onCancelAttendance={() => setIsAttendanceMode(false)}
          onSaveAttendance={handleSaveAttendance}
        />
        <CardContent className="flex-1 overflow-auto">
          <StudentsTable
            isAttendanceMode={isAttendanceMode}
            onAttendanceChange={handleAttendanceChange}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </Container>
  );
};
