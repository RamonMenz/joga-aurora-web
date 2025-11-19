import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import bodyMeasurementService from "@/api/services/bodyMeasurementService";
import { toast } from "sonner";

interface DeleteBodyMeasurementDialogProps {
  bodyMeasurementId: string;
  onBodyMeasurementDeleted: () => void;
}

export const DeleteBodyMeasurementDialog: React.FC<
  DeleteBodyMeasurementDialogProps
> = ({ bodyMeasurementId, onBodyMeasurementDeleted }) => {
  const handleDelete = async () => {
    const promise = bodyMeasurementService.delete(bodyMeasurementId);

    toast.promise(promise, {
      loading: "Excluindo medida corporal...",
      success: () => {
        onBodyMeasurementDeleted();
        return "Medida corporal excluída com sucesso!";
      },
      error: "Erro ao excluir medida corporal.",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente a
            medida corporal.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
