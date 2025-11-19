import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import physicalTestService from "@/api/services/physicalTestService";
import type { Student } from "@/types/student";
import type { PhysicalTest } from "@/types/physicalTest";
import { StudentDataValidationDialog } from "../student/student-data-validation-dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface PhysicalTestDialogProps {
  student: Student;
  physicalTest?: PhysicalTest;
  onPhysicalTestChange: () => void;
  children: React.ReactNode;
}

const physicalTestSchema = z.object({
  collectionDate: z.date({
    error: "A data da coleta é obrigatória.",
  }),
  sixMinutesTest: z.number({
    error: "O teste de 6 minutos é obrigatório.",
  }),
  flexTest: z.number({ error: "O teste de flexibilidade é obrigatório." }),
  rmlTest: z.number({ error: "O teste RML é obrigatório." }),
  twentyMetersTest: z.number({
    error: "O teste de 20 metros é obrigatório.",
  }),
  throwTwoKgTest: z.number({
    error: "O teste de arremesso de 2kg é obrigatório.",
  }),
});

type PhysicalTestFormData = z.infer<typeof physicalTestSchema>;

export const PhysicalTestDialog: React.FC<PhysicalTestDialogProps> = ({
  student,
  physicalTest,
  onPhysicalTestChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PhysicalTestFormData>({
    resolver: zodResolver(physicalTestSchema),
  });

  const isEditMode = physicalTest !== undefined;

  useEffect(() => {
    if (isEditMode) {
      reset({
        collectionDate: new Date(`${physicalTest.data_coleta}T00:00:00`),
        sixMinutesTest: physicalTest.teste_seis_minutos,
        flexTest: physicalTest.teste_flex,
        rmlTest: physicalTest.teste_rml,
        twentyMetersTest: physicalTest.teste_vinte_metros,
        throwTwoKgTest: physicalTest.teste_arremesso_dois_quilos,
      });
    } else {
      reset({
        collectionDate: new Date(),
      });
    }
  }, [isEditMode, physicalTest, reset]);

  const onSubmit = async (data: PhysicalTestFormData) => {
    const promise = isEditMode
      ? physicalTestService.update(
          physicalTest.id,
          data.collectionDate,
          data.sixMinutesTest,
          data.flexTest,
          data.rmlTest,
          data.twentyMetersTest,
          data.throwTwoKgTest
        )
      : physicalTestService.insert(
          student.id,
          data.collectionDate,
          data.sixMinutesTest,
          data.flexTest,
          data.rmlTest,
          data.twentyMetersTest,
          data.throwTwoKgTest
        );

    toast.promise(promise, {
      loading: `${isEditMode ? "Atualizando" : "Adicionando"} teste físico...`,
      success: () => {
        onPhysicalTestChange();
        setOpen(false);
        reset();
        return `Teste físico ${
          isEditMode ? "atualizado" : "adicionado"
        } com sucesso!`;
      },
      error: `Erro ao ${isEditMode ? "atualizar" : "adicionar"} teste físico.`,
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    setOpen(isOpen);
  };

  return (
    <StudentDataValidationDialog
      student={student}
      dialogType="physicalTest"
      trigger={children}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Editar Teste Físico" : "Adicionar Teste Físico"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do novo teste físico.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="collectionDate" className="text-left">
                    Data da Coleta
                  </Label>
                  <Controller
                    name="collectionDate"
                    control={control}
                    render={({ field }) => (
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
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
                              <span>Escolha uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setIsCalendarOpen(false);
                            }}
                            locale={ptBR}
                            disabled={isSubmitting}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                {errors.collectionDate && (
                  <p className="text-sm text-red-500">
                    {errors.collectionDate.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sixMinutesTest" className="text-left">
                    6 Minutos
                  </Label>
                  <Input
                    id="sixMinutesTest"
                    type="number"
                    {...register("sixMinutesTest", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.sixMinutesTest && (
                  <p className="text-sm text-red-500">
                    {errors.sixMinutesTest.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="flexTest" className="text-left">
                    Flex
                  </Label>
                  <Input
                    id="flexTest"
                    type="number"
                    {...register("flexTest", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.flexTest && (
                  <p className="text-sm text-red-500">
                    {errors.flexTest.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rmlTest" className="text-left">
                    RML
                  </Label>
                  <Input
                    id="rmlTest"
                    type="number"
                    {...register("rmlTest", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.rmlTest && (
                  <p className="text-sm text-red-500">
                    {errors.rmlTest.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="twentyMetersTest" className="text-left">
                    20 Metros
                  </Label>
                  <Input
                    id="twentyMetersTest"
                    type="number"
                    {...register("twentyMetersTest", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.twentyMetersTest && (
                  <p className="text-sm text-red-500">
                    {errors.twentyMetersTest.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="throwTwoKgTest" className="text-left">
                    Arremesso 2kg
                  </Label>
                  <Input
                    id="throwTwoKgTest"
                    type="number"
                    {...register("throwTwoKgTest", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.throwTwoKgTest && (
                  <p className="text-sm text-red-500">
                    {errors.throwTwoKgTest.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
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
    </StudentDataValidationDialog>
  );
};
