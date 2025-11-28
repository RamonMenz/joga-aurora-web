import { createContext } from "react";
import type { Page } from "@/types/page";
import type { Student } from "@/types/student";
import type { StudentFilter } from "@/types/studentFilter";

export interface StudentSearchState {
  filter?: StudentFilter;
  page: number;
  size: number;
  studentsPage?: Page<Student>;
  isLoading: boolean;
}

export interface StudentSearchContextType extends StudentSearchState {
  setFilter: (filter?: StudentFilter) => void;
  search: (opts?: { page?: number; size?: number; filter?: StudentFilter }) => Promise<void>;
  paginate: (page: number) => Promise<void>;
  changePageSize: (size: number) => Promise<void>;
  clear: () => Promise<void>;
}

export const StudentSearchContext = createContext<StudentSearchContextType | null>(null);
