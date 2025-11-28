import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { StudentSearchContext } from "./StudentSearchContext";
import type { Page } from "@/types/page";
import type { Student } from "@/types/student";
import type { StudentFilter } from "@/types/studentFilter";
import studentService from "@/api/services/studentService";

interface Props { children: ReactNode }

export function StudentSearchProvider({ children }: Props) {
  const [filter, setFilterState] = useState<StudentFilter | undefined>(undefined);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [studentsPage, setStudentsPage] = useState<Page<Student> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasEverFetched = useRef(false);

  const setFilter = useCallback((f?: StudentFilter) => {
    setFilterState(f);
  }, []);

  const performFetch = useCallback(async (opts?: { page?: number; size?: number; filter?: StudentFilter }) => {
    const nextPage = opts?.page ?? page ?? 0;
    const nextSize = opts?.size ?? size ?? 10;
    const nextFilter = opts?.filter ?? filter;
    setIsLoading(true);
    try {
      const data = await studentService.getAll({ page: nextPage, size: nextSize }, nextFilter);
      setStudentsPage(data);
      setPage(data.number ?? nextPage);
      setSize(data.size ?? nextSize);
      setFilterState(nextFilter);
      hasEverFetched.current = true;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error("Erro ao buscar estudantes:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, size, filter]);

  const search = useCallback(async (opts?: { page?: number; size?: number; filter?: StudentFilter }) => {
    await performFetch({ page: opts?.page ?? 0, size: opts?.size ?? size, filter: opts?.filter ?? filter });
  }, [performFetch, size, filter]);

  const paginate = useCallback(async (newPage: number) => {
    await performFetch({ page: newPage, size, filter });
  }, [performFetch, size, filter]);

  const changePageSize = useCallback(async (newSize: number) => {
    setSize(newSize);
    await performFetch({ page: 0, size: newSize, filter });
  }, [performFetch, filter]);

  const clear = useCallback(async () => {
    setFilterState(undefined);
    setPage(0);
    // do not auto fetch here; leave list empty until user searches or first mount happens
    setStudentsPage(undefined);
  }, []);

  const value = useMemo(() => ({
    filter,
    page,
    size,
    studentsPage,
    isLoading,
    setFilter,
    search,
    paginate,
    changePageSize,
    clear,
  }), [filter, page, size, studentsPage, isLoading, setFilter, search, paginate, changePageSize, clear]);

  return (
    <StudentSearchContext.Provider value={value}>
      {children}
    </StudentSearchContext.Provider>
  );
}

export default StudentSearchProvider;
