import { useEffect, useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useClassrooms } from "@/context/classroom/useClassroom";
import type { StudentFilter } from "@/types/studentFilter";
import { StudentsSearchTable } from "@/components/student/students-search-table";
import { StudentDialog } from "@/components/student/student-dialog";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { StudentsFilterDialog } from "@/components/student/students-filter-dialog";
import { StudentsSearchBar } from "@/components/student/students-search-bar";
import { Spinner } from "@/components/ui/spinner";
import { useStudentSearch } from "@/context/student/useStudentSearch";

export const StudentsPage = () => {
  const { classrooms } = useClassrooms();
  const { register, handleSubmit, reset, control, watch, setValue } =
    useForm<StudentFilter>({
      shouldUnregister: false,
    });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { studentsPage, isLoading, filter, size, setFilter, search, paginate, changePageSize, clear } = useStudentSearch();

  // Initialize the form with current filter from context and avoid unnecessary fetch on mount
  useEffect(() => {
    // Keep form fields in sync with context filter
    reset({
      nome: filter?.nome ?? "",
      data_nascimento_ini: filter?.data_nascimento_ini ?? undefined,
      data_nascimento_fim: filter?.data_nascimento_fim ?? undefined,
      genero: filter?.genero ?? undefined,
      turma_id: filter?.turma_id ?? undefined,
    });
  }, [filter, reset]);

  // First-load fetch only if there's no cached data
  useEffect(() => {
    if (!studentsPage && !isLoading) {
      void search({ page: 0, size, filter });
    }
  }, [studentsPage, isLoading, search, size, filter]);

  const handleSearch = useCallback(
    (data: StudentFilter) => {
      const cleanedData = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v != null && v !== "")
      );
      setFilter(cleanedData as StudentFilter | undefined);
      void search({ page: 0, size, filter: cleanedData as StudentFilter });
      setIsDialogOpen(false);
    },
    [setFilter, search, size]
  );

  const handleClear = useCallback(() => {
    reset({ nome: "", data_nascimento_ini: undefined, data_nascimento_fim: undefined, genero: undefined, turma_id: undefined });
    void clear();
    setIsDialogOpen(false);
  }, [reset, clear]);

  const handlePaginate = useCallback(
    (page: number) => {
      void paginate(page);
    },
    [paginate]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      void changePageSize(size);
    },
    [changePageSize]
  );

  const handleStudentSuccess = useCallback(() => {
    void search({ page: 0, size, filter });
  }, [search, size, filter]);

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
              pageSize={size}
              onPageSizeChange={handlePageSizeChange}
            />
          )
        )}
      </div>
    </Container>
  );
};
