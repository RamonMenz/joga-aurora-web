// src/context/classroom/ClassroomProvider.tsx
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import classroomService from "@/api/services/classroomService";
import presencaService from "@/api/services/attendanceService";
import type { Classroom } from "@/types/classroom";
import type { Attendance } from "@/types/attendance";
import { toast } from "sonner";
import { ClassroomContext } from "./ClassroomContext";

interface ClassroomProviderProps {
  children: React.ReactNode;
}

export const ClassroomProvider: React.FC<ClassroomProviderProps> = ({
  children,
}) => {
  const { id } = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const fetchClassroomData = useCallback(() => {
    if (id) {
      setLoading(true);
      classroomService
        .getById(id)
        .then((data) => {
          setClassroom(data);
          if (data.chamada_feita) {
            // If attendance was already taken today, fetch the data
            presencaService
              .getAllAttendanceByClassroomAndDate(id, null)
              .then((data) => {
                setAttendances(data);
              });
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar detalhes da turma:", error);
          toast.error("Erro ao buscar detalhes da turma.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetchClassroomData();
  }, [fetchClassroomData]);

  const value = {
    classroom,
    loading,
    attendances,
    setAttendances,
    fetchClassroomData,
  };

  return (
    <ClassroomContext.Provider value={value}>
      {children}
    </ClassroomContext.Provider>
  );
};
