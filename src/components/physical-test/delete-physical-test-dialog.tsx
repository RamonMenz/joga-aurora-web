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
import physicalTestService from "@/api/services/physicalTestService";
import { toast } from "sonner";

interface DeletePhysicalTestDialogProps {
  physicalTestId: string;
  onPhysicalTestDeleted: () => void;
}

export const DeletePhysicalTestDialog: React.FC<
  DeletePhysicalTestDialogProps
> = ({ physicalTestId, onPhysicalTestDeleted }) => {
  const handleDelete = async () => {
    const promise = physicalTestService.delete(physicalTestId);

    toast.promise(promise, {
      loading: "Excluindo teste físico...",
      success: () => {
        onPhysicalTestDeleted();
        return "Teste físico excluído com sucesso!";
      },
      error: "Erro ao excluir teste físico.",
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
            Essa ação não pode ser desfeita. Isso irá excluir permanentemente o
            teste físico.
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
