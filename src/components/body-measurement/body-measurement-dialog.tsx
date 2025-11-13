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
import bodyMeasurementService from "@/api/services/bodyMeasurementService";
import type { Student } from "@/types/student";
import type { BodyMeasurement } from "@/types/bodyMeasurement";
import { StudentDataValidationDialog } from "@/components/student/student-data-validation-dialog";

interface BodyMeasurementDialogProps {
  student: Student;
  bodyMeasurement?: BodyMeasurement;
  onBodyMeasurementChange: () => void;
  children: React.ReactNode;
}

const bodyMeasurementSchema = z.object({
  collectionDate: z.date({
    error: "A data da coleta é obrigatória.",
  }),
  weight: z
    .number({
      error: "O peso é obrigatório.",
    })
    .positive("O peso deve ser um número positivo."),
  height: z
    .number({
      error: "A estatura é obrigatória.",
    })
    .positive("A estatura deve ser um número positivo."),
  waist: z
    .number({
      error: "A cintura é obrigatória.",
    })
    .positive("A cintura deve ser um número positivo."),
});

type BodyMeasurementFormData = z.infer<typeof bodyMeasurementSchema>;

export const BodyMeasurementDialog: React.FC<BodyMeasurementDialogProps> = ({
  student,
  bodyMeasurement,
  onBodyMeasurementChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BodyMeasurementFormData>({
    resolver: zodResolver(bodyMeasurementSchema),
  });

  const isEditMode = bodyMeasurement !== undefined;

  useEffect(() => {
    if (isEditMode) {
      reset({
        collectionDate: new Date(`${bodyMeasurement.data_coleta}T00:00:00`),
        weight: bodyMeasurement.peso,
        height: bodyMeasurement.estatura,
        waist: bodyMeasurement.cintura,
      });
    } else {
      reset({
        collectionDate: new Date(),
      });
    }
  }, [isEditMode, bodyMeasurement, reset]);

  const onSubmit = async (data: BodyMeasurementFormData) => {
    const promise = isEditMode
      ? bodyMeasurementService.update(
          bodyMeasurement.id,
          data.collectionDate,
          data.waist,
          data.weight,
          data.height
        )
      : bodyMeasurementService.insert(
          student.id,
          data.collectionDate,
          data.waist,
          data.weight,
          data.height
        );

    toast.promise(promise, {
      loading: `${
        isEditMode ? "Atualizando" : "Adicionando"
      } medida corporal...`,
      success: () => {
        reset();
        onBodyMeasurementChange();
        setOpen(false);
        return `Medida corporal ${
          isEditMode ? "atualizada" : "adicionada"
        } com sucesso!`;
      },
      error: `Erro ao ${
        isEditMode ? "atualizar" : "adicionar"
      } medida corporal.`,
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
      dialogType="bodyMeasurement"
      trigger={children}
    >
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode
                ? "Editar Medida Corporal"
                : "Adicionar Nova Medida Corporal"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da medida corporal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                      <Popover>
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
                            captionLayout="dropdown"
                            locale={ptBR}
                            selected={field.value}
                            onSelect={field.onChange}
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
                  <Label htmlFor="weight" className="text-left">
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.weight && (
                  <p className="text-sm text-red-500">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-left">
                    Estatura (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.height && (
                  <p className="text-sm text-red-500">
                    {errors.height.message}
                  </p>
                )}
              </div>
              <div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="waist" className="text-left">
                    Cintura (cm)
                  </Label>
                  <Input
                    id="waist"
                    type="number"
                    {...register("waist", { valueAsNumber: true })}
                    className="col-span-3"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.waist && (
                  <p className="text-sm text-red-500">
                    {errors.waist.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
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
