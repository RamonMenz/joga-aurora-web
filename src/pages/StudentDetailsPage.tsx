import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentService from "@/api/services/studentService";
import type { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Container } from "@/components/common/container";
import { DeleteStudentDialog } from "../components/student/delete-student-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { StudentDialog } from "@/components/student/student-dialog";
import { format } from "date-fns";
import { BodyMeasurementSection } from "@/components/body-measurement/body-measurement-section";
import { PhysicalTestSection } from "@/components/physical-test/physical-test-section";

export const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const navigate = useNavigate();

  const handleStudentUpdated = () => {
    setUpdate((u) => u + 1);
  };

  const handleStudentDeleted = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      studentService
        .getById(id)
        .then((data) => setStudent(data))
        .catch((error) => {
          console.error("Erro ao buscar detalhes do estudante:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, update]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center p-4">
        <h1 className="text-xl">Estudante não encontrado.</h1>
      </div>
    );
  }

  return (
    <Container className="overflow-auto">
      <div className="flex flex-col gap-8 pb-8 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">{student.nome}</CardTitle>
            <div className="flex flex-col gap-2 justify-end">
              <StudentDialog
                student={student}
                onSuccess={handleStudentUpdated}
                trigger={
                  <Button variant={"outline"}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Estudante
                  </Button>
                }
              />
              <DeleteStudentDialog
                studentId={student.id}
                studentName={student.nome}
                onStudentDeleted={handleStudentDeleted}
              />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>Data de Nascimento: </strong>
              {format(JSON.stringify(student.data_nascimento), "dd/MM/yyyy")}
            </p>
            <p>
              <strong>Gênero: </strong>
              {student.genero}
            </p>
            <p>
              <strong>Turma: </strong>
              {student.turma.nome}
            </p>
          </CardContent>
        </Card>

        <BodyMeasurementSection
          student={student}
          onDataChanged={handleStudentUpdated}
        />

        <PhysicalTestSection
          student={student}
          onDataChanged={handleStudentUpdated}
        />
      </div>
    </Container>
  );
};
