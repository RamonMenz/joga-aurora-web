import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  GENDERS,
  type Gender,
  type Student,
  type RequestGender,
} from "@/types/student";
import type { Classroom } from "@/types/classroom";
import studentService from "@/api/services/studentService";
import { useClassrooms } from "@/context/classroom/useClassroom";
import { toast } from "sonner";
import { toBackendGender } from "@/util/gender";
import { ptBR } from "date-fns/locale";

interface StudentDialogProps {
  student?: Student;
  classroomId?: string;
  onSuccess: () => void;
  trigger: React.ReactNode;
}

const studentSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(256, "O nome é muito longo."),
  birthDate: z.date({
    error: "A data de nascimento é obrigatória.",
  }),
  gender: z.enum(["M", "F", "N"]),
  classroomId: z.string().min(1, "A turma é obrigatória."),
});

type StudentFormData = z.infer<typeof studentSchema>;

export const StudentDialog: React.FC<StudentDialogProps> = ({
  student,
  classroomId,
  onSuccess,
  trigger,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { classrooms: contextClassrooms, loadClassrooms } = useClassrooms();

  const isEditMode = !!student;

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  const watchedGender = watch("gender");


  useEffect(() => {
    if (isDialogOpen) {
      if (!contextClassrooms || contextClassrooms.length === 0) {
        void loadClassrooms();
      }
      setClassrooms(contextClassrooms ?? []);
    }
  }, [isDialogOpen, contextClassrooms, loadClassrooms]);

  useEffect(() => {
    if (!isDialogOpen) {
      setIsCalendarOpen(false);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (isDialogOpen) {
      if (isEditMode) {
        reset({
          name: student.nome,
          birthDate: student.data_nascimento
            ? new Date(`${student.data_nascimento}T00:00:00`)
            : undefined,
          gender: toBackendGender(student.genero as Gender),
          classroomId: student.turma.id,
        });
      } else {
        reset({
          name: "",
          gender: "N",
          classroomId: classroomId || "",
        });
      }
    }
  }, [isDialogOpen, isEditMode, student, classroomId, reset]);

  const onSubmit = async (data: StudentFormData) => {
    try {
      if (isEditMode) {
        await studentService.update(
          student.id,
          data.name,
          data.birthDate,
          data.gender as RequestGender,
          data.classroomId
        );
        toast.success("Estudante atualizado com sucesso!");
      } else {
        await studentService.insert(
          data.name,
          data.birthDate,
          data.gender as RequestGender,
          data.classroomId
        );
        toast.success("Estudante adicionado com sucesso!");
      }
      onSuccess();
      setIsDialogOpen(false);
    } catch (error) {
      console.error(
        `Erro ao ${isEditMode ? "atualizar" : "adicionar"} estudante:`,
        error
      );
      toast.error(
        `Erro ao ${isEditMode ? "atualizar" : "adicionar"} estudante.`
      );
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Estudante" : "Adicionar Novo Estudante"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Altere os dados do estudante. Clique em salvar para aplicar as mudanças."
              : "Preencha os dados do novo estudante para adicioná-lo à turma."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 py-4">
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Nome
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="data_nascimento" className="text-left">
                  Data de Nascimento
                </Label>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          id="data_nascimento"
                          className={cn(
                            "col-span-3 justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          locale={ptBR}
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={isSubmitting}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              {errors.birthDate && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-left">
                  Gênero
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="col-span-3 flex space-x-1"
                      disabled={isSubmitting}
                    >
                      {GENDERS.map((gender) => (
                        <div
                          key={gender}
                          className="flex items-center space-x-1"
                        >
                          <RadioGroupItem
                            value={toBackendGender(gender)}
                            id={toBackendGender(gender)}
                          />
                          <Label htmlFor={toBackendGender(gender)}>
                            {gender}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
              {watchedGender === "N" && (
                <p className="text-sm text-yellow-600">
                  Não é recomendado, mas o cadastro pode ser feito sem informar
                  o gênero do estudante.
                </p>
              )}
            </div>
            <div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="turma" className="text-left">
                  Turma
                </Label>
                <Controller
                  name="classroomId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || (!isEditMode && !!classroomId)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classrooms.map((classroom) => (
                          <SelectItem
                            key={classroom.id}
                            value={classroom.id.toString()}
                          >
                            {classroom.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.classroomId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.classroomId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="space-y-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
