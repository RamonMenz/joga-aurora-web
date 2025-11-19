import { useState, useEffect, useCallback, useMemo } from "react";
import classroomService from "@/api/services/classroomService";
import attendanceService from "@/api/services/attendanceService";
import { toast } from "sonner";
import { ClassroomsContext } from "./ClassroomContext";
import type { Classroom } from "@/types/classroom";
import type { Attendance } from "@/types/attendance";
import { useAuth } from "../auth/useAuth";

interface ClassroomsProviderProps {
  children: React.ReactNode;
}

export const ClassroomsProvider: React.FC<ClassroomsProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Lista de turmas
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [areClassroomsLoading, setAreClassroomsLoading] = useState(false);
  // Turma atual
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isClassroomLoading, setIsClassroomLoading] = useState(false);
  // Presenças da turma atual
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const loadClassrooms = useCallback(async () => {
    if (!isAuthenticated) {
      setClassrooms([]);
      return;
    }

    setAreClassroomsLoading(true);
    try {
      const data = await classroomService.getAll({ page: 0, size: 100 });
      setClassrooms(data.content ?? []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro ao buscar turmas:", error);
      }
      toast.error("Erro ao carregar turmas.");
    } finally {
      setAreClassroomsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadClassrooms();
  }, [loadClassrooms]);

  const getCurrentClassroomIdFromUrl = useCallback((): string | null => {
    try {
      const path = window.location.pathname;
      const match = path.match(/^\/turmas\/([^/?#]+)/);
      return match?.[1] ?? null;
    } catch {
      return null;
    }
  }, []);

  const loadClassroom = useCallback(async () => {
    const id = getCurrentClassroomIdFromUrl();
    if (!id) {
      setClassroom(null);
      setAttendances([]);
      return;
    }

    setIsClassroomLoading(true);
    try {
      const data = await classroomService.getById(id);
      setClassroom(data);
      if (data.chamada_feita) {
        const list = await attendanceService.getAllAttendanceByClassroomAndDate(id, null);
        setAttendances(list);
      } else {
        setAttendances([]);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro ao buscar detalhes da turma:", error);
      }
      toast.error("Erro ao buscar detalhes da turma.");
    } finally {
      setIsClassroomLoading(false);
    }
  }, [getCurrentClassroomIdFromUrl]);

  const clearClassroom = useCallback(() => {
    setClassroom(null);
    setAttendances([]);
  }, []);

  // Memo minimiza re-renders em consumidores que não usam todas as propriedades
  const value = useMemo(
    () => ({
      classrooms,
      areClassroomsLoading,
      loadClassrooms,
      classroom,
      isClassroomLoading,
      loadClassroom,
      clearClassroom,
      attendances,
      // Expor método de atualização controlada em vez de set raw
      updateAttendanceList: (updater: (prev: Attendance[]) => Attendance[]) =>
        setAttendances((prev) => updater(prev)),
    }), [
      classrooms,
      areClassroomsLoading,
      loadClassrooms,
      classroom,
      isClassroomLoading,
      loadClassroom,
      clearClassroom,
      attendances,
    ]
  );

  return <ClassroomsContext.Provider value={value}>{children}</ClassroomsContext.Provider>;
};

export default ClassroomsProvider;
