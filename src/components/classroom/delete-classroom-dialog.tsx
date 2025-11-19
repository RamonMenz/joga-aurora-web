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
import { TrashIcon } from "lucide-react";
import classroomService from "@/api/services/classroomService";
import { toast } from "sonner";
import { useClassrooms } from "@/context/classroom/useClassroom";
import type { Classroom } from "@/types/classroom";

interface DeleteClassroomDialogProps {
  classroom: Classroom;
  onClassroomDeleted: () => void;
}

export const DeleteClassroomDialog: React.FC<DeleteClassroomDialogProps> = ({
  classroom,
  onClassroomDeleted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { loadClassrooms } = useClassrooms();

  const hasStudents = classroom.estudantes && classroom.estudantes.length > 0;

  const handleDelete = async () => {
    if (hasStudents) {
      return;
    }

    const promise = classroomService.delete(classroom.id);

    toast.promise(promise, {
      loading: "Excluindo turma...",
      success: () => {
        // Refresh global classrooms list, then call the callback
        void loadClassrooms();
        onClassroomDeleted();
        setIsOpen(false);
        navigate("/turmas");
        return `Turma "${classroom.nome}" excluída com sucesso.`;
      },
      error: "Erro ao excluir turma.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          Excluir Turma
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            {hasStudents
              ? "Esta turma possui estudantes matriculados e não pode ser excluída. Por favor, remova os estudantes antes de excluir a turma."
              : `Tem certeza que deseja excluir a turma "${classroom.nome}"? Essa ação não pode ser desfeita.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            {hasStudents ? "Fechar" : "Cancelar"}
          </Button>
          {!hasStudents && (
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
