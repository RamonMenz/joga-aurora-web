import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import studentService from "@/api/services/studentService";
import classroomService from "@/api/services/classroomService";
import type { Student } from "@/types/student";
import type { StudentFilter } from "@/types/studentFilter";
import type { Classroom } from "@/types/classroom";
import type { Page } from "@/types/page";
import { StudentsSearchTable } from "@/components/student/students-search-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Container } from "@/components/common/container";
import { GENDERS } from "@/util/gender";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export const StudentsPage = () => {
  const [studentsPage, setStudentsPage] = useState<Page<Student>>();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { register, handleSubmit, reset, control, watch, setValue } = useForm<StudentFilter>({
    // Keep values for fields rendered inside the Dialog even when it closes
    shouldUnregister: false,
  });
  const [filter, setFilter] = useState<StudentFilter | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchStudents = async (page = 0, size?: number, f?: StudentFilter) => {
    const effectiveSize = size ?? pageSize;
    const effectiveFilter = f ?? filter;
    const data = await studentService.getAll({ page, size: effectiveSize }, effectiveFilter);
    console.log("Fetched students page:", data);
    setStudentsPage(data);
  };

  const fetchClassrooms = async () => {
    const data = await classroomService.getAll({ page: 0, size: 100 });
    setClassrooms(data.content);
  };

  useEffect(() => {
    fetchStudents(0, pageSize);
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (data: StudentFilter) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v != null && v !== "")
    );
    setFilter(cleanedData);
    fetchStudents(0, pageSize, cleanedData);
    setIsDialogOpen(false);
  };

  const handleClear = () => {
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
  };

  const handlePaginate = (page: number) => {
    fetchStudents(page, pageSize, filter);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    // Reset to first page when page size changes
    fetchStudents(0, size, filter);
  };

  return (
    <Container>
      {/* Top bar with quick name search and advanced filters trigger */}
      <div className="flex items-center gap-2 mb-4">
        <form
          id="students-filter-form"
          onSubmit={handleSubmit(handleSearch)}
          className="flex w-full items-center gap-2"
        >
          <Input
            id="nome"
            placeholder="Pesquisar por nome..."
            className="flex-1"
            {...register("nome")}
          />
          <Button type="submit">Pesquisar</Button>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline">Filtros avançados</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Filtros avançados</DialogTitle>
            </DialogHeader>
            {/* Advanced filters (values persist even when dialog is closed) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label className="mb-1 block">Nascimento (período)</Label>
                {/* Range calendar controlled via the two Date fields in the form */}
                {(() => {
                  const from = watch("data_nascimento_ini");
                  const to = watch("data_nascimento_fim");
                  const selected: DateRange | undefined = from || to ? { from, to } : undefined;
                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selected && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selected?.from ? (
                            selected.to ? (
                              <span>
                                {format(selected.from, "dd/MM/yyyy", { locale: ptBR })} - {" "}
                                {format(selected.to, "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            ) : (
                              <span>
                                {format(selected.from, "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                            )
                          ) : (
                            <span>Selecione um período</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          captionLayout="dropdown"
                          numberOfMonths={2}
                          locale={ptBR}
                          selected={selected}
                          onSelect={(range) => {
                            setValue("data_nascimento_ini", range?.from);
                            setValue("data_nascimento_fim", range?.to);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  );
                })()}
              </div>
              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Controller
                  name="genero"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "all" ? undefined : value)
                      }
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {GENDERS.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="turma_id">Turma</Label>
                <Controller
                  name="turma_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "all" ? undefined : value)
                      }
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {classrooms.map((classroom) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClear}>
                Limpar
              </Button>
              {/* Submit the main form from within the dialog */}
              <Button type="submit" form="students-filter-form">
                Pesquisar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full mt-8">
        {studentsPage &&
        <StudentsSearchTable
          studentsPage={studentsPage}
          onPaginate={handlePaginate}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />}
      </div>
    </Container>
  );
};
