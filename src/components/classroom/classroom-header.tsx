// src/pages/ClassroomDetails/ClassroomHeader.tsx
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClipboardCheck, UserPlus } from "lucide-react";
import { StudentDialog } from "@/components/student/student-dialog";
import { UpdateClassroomDialog } from "@/components/classroom/update-classroom-dialog";
import { DeleteClassroomDialog } from "@/components/classroom/delete-classroom-dialog";
import useClassrooms from "@/context/classroom/useClassroom";

interface ClassroomHeaderProps {
  isAttendanceMode: boolean;
  onStartAttendance: () => void;
  onCancelAttendance: () => void;
  onSaveAttendance: () => void;
}

/**
 * @description The header component for the classroom details page.
 * It displays the classroom name and action buttons.
 * @param isAttendanceMode A boolean indicating if the component is in attendance mode.
 * @param onStartAttendance A callback function to be called when the "Registrar Presença" button is clicked.
 */
export const ClassroomHeader: React.FC<ClassroomHeaderProps> = ({
  isAttendanceMode,
  onStartAttendance,
  onCancelAttendance,
  onSaveAttendance,
}) => {
  const { classroom, loadClassroom } = useClassrooms();
  const navigate = useNavigate();

  if (!classroom) {
    return null;
  }

  const { nome, id, chamada_feita, estudantes } = classroom;

  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-2xl">{nome}</CardTitle>
      <div className="flex flex-col gap-2 justify-end">
        {isAttendanceMode ? (
          <>
            <Button onClick={onSaveAttendance}>Salvar Chamada</Button>
            <Button variant="outline" onClick={onCancelAttendance}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-end">
              <StudentDialog
                classroomId={id}
                onSuccess={loadClassroom}
                trigger={
                  <Button variant={"outline"}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Estudante
                  </Button>
                }
              />
              <UpdateClassroomDialog
                classroomId={id}
                classroomName={nome}
                onClassroomUpdated={loadClassroom}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-end pl-9">
              {estudantes != null && estudantes.length > 0 && (
                <Button variant={"outline"} onClick={onStartAttendance}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  {chamada_feita ? "Editar Presença" : "Registrar Presença"}
                </Button>
              )}
              <DeleteClassroomDialog
                classroom={classroom}
                onClassroomDeleted={() => navigate("/turmas")}
              />
            </div>
          </>
        )}
      </div>
    </CardHeader>
  );
};
