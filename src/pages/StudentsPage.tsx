import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import studentService from "@/api/services/studentService";
import { useClassrooms } from "@/context/classroom/useClassroom";
import type { Student } from "@/types/student";
import type { StudentFilter } from "@/types/studentFilter";
import type { Page } from "@/types/page";
import { StudentsSearchTable } from "@/components/student/students-search-table";
import { StudentDialog } from "@/components/student/student-dialog";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { StudentsFilterDialog } from "@/components/student/students-filter-dialog";
import { StudentsSearchBar } from "@/components/student/students-search-bar";
import { Spinner } from "@/components/ui/spinner";

export const StudentsPage = () => {
  const [studentsPage, setStudentsPage] = useState<Page<Student>>();
  const [isLoading, setIsLoading] = useState(true);
  const { classrooms } = useClassrooms();
  const { register, handleSubmit, reset, control, watch, setValue } =
    useForm<StudentFilter>({
      shouldUnregister: false,
    });
  const [filter, setFilter] = useState<StudentFilter | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchStudents = useCallback(
    async (page = 0, size?: number, f?: StudentFilter) => {
      setIsLoading(true);
      try {
        const effectiveSize = size ?? pageSize;
        const effectiveFilter = f ?? filter;
        const data = await studentService.getAll(
          { page, size: effectiveSize },
          effectiveFilter
        );
        setStudentsPage(data);
      } catch (error) {
        console.error("Erro ao buscar estudantes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, filter]
  );

  useEffect(() => {
    fetchStudents(0, pageSize);
  }, [fetchStudents, pageSize]);

  const handleSearch = useCallback(
    (data: StudentFilter) => {
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v != null && v !== "")
      );
      setFilter(cleanedData);
      fetchStudents(0, pageSize, cleanedData);
      setIsDialogOpen(false);
    },
    [fetchStudents, pageSize]
  );

  const handleClear = useCallback(() => {
    reset({
      nome: "",
      data_nascimento_ini: undefined,
      data_nascimento_fim: undefined,
      genero: undefined,
      turma_id: undefined,
    });
    setFilter(undefined);
    fetchStudents(0, pageSize, undefined);
    setIsDialogOpen(false);
  }, [reset, fetchStudents, pageSize]);

  const handlePaginate = useCallback(
    (page: number) => {
      fetchStudents(page, pageSize, filter);
    },
    [fetchStudents, pageSize, filter]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size);
      fetchStudents(0, size, filter);
    },
    [fetchStudents, filter]
  );

  const handleStudentSuccess = useCallback(() => {
    fetchStudents(0, pageSize, filter);
  }, [fetchStudents, pageSize, filter]);

  // No-op memo to keep hooks order; filters moved to StudentsFilterDialog component
  useMemo(() => undefined, []);

  return (
    <Container>
      <div className="m-8">
        <div className="flex items-center gap-2">
          <StudentDialog
            onSuccess={handleStudentSuccess}
            trigger={<Button type="button">Adicionar estudante</Button>}
          />
          <StudentsFilterDialog
            trigger={
              <Button type="button" variant="outline">
                Filtros avançados
              </Button>
            }
            control={control}
            watch={watch}
            setValue={setValue}
            classrooms={classrooms}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onClear={handleClear}
            formId="students-filter-form"
          />
        </div>

        <div className="mt-4">
          <StudentsSearchBar
            formId="students-filter-form"
            onSubmit={handleSubmit(handleSearch)}
            register={register}
          />
        </div>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          studentsPage && (
            <StudentsSearchTable
              studentsPage={studentsPage}
              onPaginate={handlePaginate}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          )
        )}
      </div>
    </Container>
  );
};
