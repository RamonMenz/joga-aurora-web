import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon, Ban } from "lucide-react";
import studentService from "@/api/services/studentService";
import { toast } from "sonner";

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
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const promise = studentService.delete(studentId);

    toast.promise(promise, {
      loading: "Excluindo estudante...",
      success: () => {
        onStudentDeleted();
        setIsOpen(false);
        navigate(`/turmas`);
        return `Estudante "${studentName}" excluído com sucesso.`;
      },
      error: "Erro ao excluir estudante.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover o estudante "{studentName}"? Todos os seus dados, incluindo registros de presença, medidas corporais e testes físicos serão perdidos. Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <Ban className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
