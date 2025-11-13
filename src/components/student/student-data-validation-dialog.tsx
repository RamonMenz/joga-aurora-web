import { useState } from "react";
import type { Student } from "@/types/student";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StudentDataValidationDialogProps {
  student: Student;
  dialogType: "bodyMeasurement" | "physicalTest";
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const calculateAge = (birthDate: string | Date) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const StudentDataValidationDialog: React.FC<
  StudentDataValidationDialogProps
> = ({ student, dialogType, children, trigger }) => {
  const [open, setOpen] = useState(false);

  const studentAge = calculateAge(student.data_nascimento);
  const isGenderMissing = student.genero === "Não informado";
  const isAgeInvalid = studentAge < 6 || studentAge > 17;

  const isInvalid = isGenderMissing || isAgeInvalid;

  const getDialogContent = () => {
    let title = "Dados Incompletos ou Inválidos";
    let description = "";
    const item =
      dialogType === "bodyMeasurement" ? "medidas corporais" : "testes físicos";

    if (isGenderMissing && isAgeInvalid) {
      description = `O gênero do estudante precisa ser informado e a idade deve estar entre 6 e 17 anos para adicionar ${item}. Por favor, atualize o cadastro.`;
    } else if (isGenderMissing) {
      title = "Gênero não informado";
      description = `É necessário informar o gênero do estudante para adicionar ${item}. Por favor, atualize o cadastro do estudante.`;
    } else if (isAgeInvalid) {
      title = "Idade fora do permitido";
      description = `A idade do estudante deve estar entre 6 e 17 anos para adicionar ${item}. Por favor, atualize o cadastro do estudante.`;
    }
    return { title, description };
  };

  const { title, description } = getDialogContent();

  if (isInvalid) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{children}</>;
};
