import type { Student } from "./student";

export type AttendanceStatus = "Presente" | "Atrasado" | "Ausente";
export type RequestAttendanceStatus = "P" | "A" | "L";

export interface Attendance {
  id: string | null;
  estudante: Student;
  data_presenca: Date | null;
  status: AttendanceStatus | RequestAttendanceStatus;
}
