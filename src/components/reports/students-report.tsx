import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { reportService } from "@/api/services/reportService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import classroomService from "@/api/services/classroomService";
import type { Classroom } from "@/types/classroom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TOAST_MESSAGES } from "@/util/constants";

const formSchema = z.object({
  classroomId: z.string().min(1, { message: "Selecione uma turma" }),
  startDate: z.date("Selecione a data inicial"),
  endDate: z.date("Selecione a data final"),
}).refine(d => d.endDate >= d.startDate, { path: ["endDate"], message: "A data final deve ser maior ou igual à inicial" });

type FormValues = z.infer<typeof formSchema>;

export function StudentsReport() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { classroomId: "", startDate: undefined, endDate: undefined },
  });

  useEffect(() => { classroomService.getAll({ page: 0, size: 100 }).then(d => setClassrooms(d.content)); }, []);

  const onSubmit = async (values: FormValues) => {
    toast.promise(reportService.getStudentsReport(values.classroomId, values.startDate, values.endDate), {
      loading: TOAST_MESSAGES.LOADING.LOADING,
      success: (response) => {
        const blob = new Blob([response as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "students_report.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return "Relatório gerado com sucesso!";
      },
      error: (error: unknown) => {
        const axiosMessage = typeof error === "object" && error !== null && // @ts-expect-error acessar estrutura específica de erro Axios sem tipagem
          error.response?.data?.message;
        console.error("Erro ao gerar relatório:", error);
        return axiosMessage || TOAST_MESSAGES.ERROR.GENERIC;
      }
    });
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Relatório de Estudantes</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center mb-4 w-full" noValidate>
        <div className="w-full">
          <Controller control={control} name="classroomId" render={({ field }) => (
            <>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full" aria-invalid={!!errors.classroomId}>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {classrooms.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.classroomId && <p className="text-sm text-red-500">{errors.classroomId.message}</p>}
            </>
          )} />
        </div>
        <div className="w-full">
          <Controller control={control} name="startDate" render={({ field }) => (
            <>
              <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" aria-invalid={!!errors.startDate}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Data inicial</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" captionLayout="dropdown" locale={ptBR} selected={field.value} onSelect={(date) => { field.onChange(date); setIsStartOpen(false); }} />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </>
          )} />
        </div>
        <div className="w-full">
          <Controller control={control} name="endDate" render={({ field }) => (
            <>
              <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" aria-invalid={!!errors.endDate}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Data final</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" captionLayout="dropdown" locale={ptBR} selected={field.value} onSelect={(date) => { field.onChange(date); setIsEndOpen(false); }} />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
            </>
          )} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full max-w-auto">
          {isSubmitting ? "Gerando..." : "Baixar Relatório"}
        </Button>
      </form>
    </div>
  );
}