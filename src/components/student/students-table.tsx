// src/pages/ClassroomDetails/AttendanceTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AttendanceStatus } from "@/types/attendance";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useClassrooms } from "@/context/classroom/useClassroom";
import type { Student } from "@/types/student";
import type { Attendance } from "@/types/attendance";

interface AttendanceTableProps {
  isAttendanceMode: boolean;
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
  onRowClick: (studentId: string) => void;
}

/**
 * @description A table component for displaying and managing student attendance.
 * @param isAttendanceMode A boolean indicating if the component is in attendance mode.
 * @param onAttendanceChange A callback function to be called when the attendance status of a student is changed.
 * @param onRowClick A callback function to be called when a row is clicked.
 */
export const StudentsTable: React.FC<AttendanceTableProps> = ({
  isAttendanceMode,
  onAttendanceChange,
  onRowClick,
}) => {
  const { classroom, attendances } = useClassrooms();

  if (!classroom) {
    return null;
  }

  const { estudantes } = classroom;

  return (
    <div className="overflow-auto">
      {estudantes != null && estudantes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estudante</TableHead>
              {isAttendanceMode && <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {estudantes.map((student: Student) => {
              const attendance = attendances.find(
                (att: Attendance) => att.estudante.id === student.id
              );
              const status = attendance?.status || "Ausente";

              return (
                <TableRow
                  key={student.id}
                  onClick={() => onRowClick(student.id)}
                  className={isAttendanceMode ? "" : "cursor-pointer"}
                >
                  <TableCell>{student.nome}</TableCell>
                  {isAttendanceMode && (
                    <TableCell>
                      <RadioGroup
                        value={status}
                        onValueChange={(value) =>
                          onAttendanceChange(
                            student.id,
                            value as AttendanceStatus
                          )
                        }
                        className="flex space-x-2 gap-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem
                            value="Presente"
                            id={`presente-${student.id}`}
                          />
                          <Label htmlFor={`presente-${student.id}`}>
                            Presente
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem
                            value="Atrasado"
                            id={`atrasado-${student.id}`}
                          />
                          <Label htmlFor={`atrasado-${student.id}`}>
                            Atrasado
                          </Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem
                            value="Ausente"
                            id={`ausente-${student.id}`}
                          />
                          <Label htmlFor={`ausente-${student.id}`}>
                            Ausente
                          </Label>
                        </div>
                      </RadioGroup>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground">
          Nenhum estudante encontrado.
        </div>
      )}
    </div>
  );
};
