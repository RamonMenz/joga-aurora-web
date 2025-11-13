// src/context/classroom/ClassroomContext.tsx
import type { Classroom } from "@/types/classroom";
import type { Attendance } from "@/types/attendance";
import { createContext } from "react";

export interface ClassroomContextType {
  classroom: Classroom | null;
  loading: boolean;
  attendances: Attendance[];
  setAttendances: React.Dispatch<React.SetStateAction<Attendance[]>>;
  fetchClassroomData: () => void;
}

export const ClassroomContext = createContext<ClassroomContextType | null>(
  null
);
