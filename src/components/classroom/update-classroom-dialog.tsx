import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import classroomService from "@/api/services/classroomService";
import { toast } from "sonner";
import { useClassrooms } from "@/context/classroom/useClassroom";
import { Pencil } from "lucide-react";

interface UpdateClassroomDialogProps {
  classroomId: string;
  classroomName: string;
  onClassroomUpdated: () => void;
}

const updateClassroomSchema = z.object({
  name: z
    .string()
    .min(3, "O nome da turma deve ter pelo menos 3 caracteres.")
    .max(256, "O nome da turma é muito longo."),
});

type UpdateClassroomFormData = z.infer<typeof updateClassroomSchema>;

export const UpdateClassroomDialog: React.FC<UpdateClassroomDialogProps> = ({
  classroomId,
  classroomName,
  onClassroomUpdated,
}) => {
  const { loadClassrooms } = useClassrooms();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateClassroomFormData>({
    resolver: zodResolver(updateClassroomSchema),
    defaultValues: {
      name: classroomName,
    },
  });

  const onSubmit = async (data: UpdateClassroomFormData) => {
    toast.promise(classroomService.update(classroomId, data.name), {
      loading: "Editando turma...",
      success: () => {
        reset({ name: data.name });
        onClassroomUpdated();
        void loadClassrooms();
        return "Turma editada com sucesso!";
      },
      error: (error) => {
        return error.response?.data?.message || "Erro ao criar turma.";
      },
    });
  };

  useEffect(() => {
    if (errors.name) {
      toast.error(errors.name.message);
    }
  }, [errors]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          reset({ name: classroomName });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="mr-2 h-4 w-4" />
          Editar Turma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Turma {classroomName}</DialogTitle>
          <DialogDescription>
            Preencha os dados da turma para editá-la.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                {...register("name")}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
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
