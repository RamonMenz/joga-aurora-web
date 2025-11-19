import type { Classroom } from "@/types/classroom";
import type { Attendance } from "@/types/attendance";
import { createContext } from "react";

export interface ClassroomsContextType {
  classrooms: Classroom[];
  areClassroomsLoading: boolean;
  loadClassrooms: () => Promise<void>;

  classroom: Classroom | null;
  isClassroomLoading: boolean;
  loadClassroom: () => Promise<void>;
  clearClassroom: () => void;

  attendances: Attendance[];
  updateAttendanceList: (updater: (prev: Attendance[]) => Attendance[]) => void;
}

export const ClassroomsContext = createContext<ClassroomsContextType | null>(null);
