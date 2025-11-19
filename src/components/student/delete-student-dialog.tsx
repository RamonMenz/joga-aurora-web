import { useNavigate } from "react-router-dom";
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
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import studentService from "@/api/services/studentService";

interface DeleteStudentDialogProps {
  studentId: string;
  studentName: string;
  onStudentDeleted: () => void;
}

export const DeleteStudentDialog: React.FC<DeleteStudentDialogProps> = ({
  studentId,
  studentName,
  onStudentDeleted,
}) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    toast.promise(studentService.delete(studentId), {
      loading: "Excluindo estudante...",
      success: () => {
        onStudentDeleted();
        navigate(`/turmas`);
        return `Estudante "${studentName}" excluído com sucesso.`;
      },
      error: "Erro ao excluir estudante.",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir Estudante
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o estudante "{studentName}"? Todos os
            seus dados, incluindo registros de presença, medidas corporais e
            testes físicos serão perdidos. Essa ação não pode ser desfeita.
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
