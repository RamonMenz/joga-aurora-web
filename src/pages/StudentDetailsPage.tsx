import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentService from "@/api/services/studentService";
import type { Student } from "@/types/student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/common/page-loader";
import { Container } from "@/components/common/container";
import { DeleteStudentDialog } from "@/components/student/delete-student-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { StudentDialog } from "@/components/student/student-dialog";
import { BodyMeasurementSection } from "@/components/body-measurement/body-measurement-section";
import { PhysicalTestSection } from "@/components/physical-test/physical-test-section";
import { EmptyState } from "@/components/common/empty-state";
import { format } from "date-fns";

export const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(0);
  const navigate = useNavigate();

  const handleStudentUpdated = useCallback(() => {
    setUpdate((u) => u + 1);
  }, []);

  const handleStudentDeleted = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    studentService
      .getById(id)
      .then((data) => setStudent(data))
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error("Erro ao buscar detalhes do estudante:", error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, update]);

  if (loading) {
    return <PageLoader message="Carregando estudante..." />;
  }

  if (!student) {
    return (
      <Container>
        <EmptyState
          title="Estudante não encontrado"
          description="O estudante que você procura não existe ou foi removido."
        />
      </Container>
    );
  }

  const BirthDate: React.FC<{ value: Date | string }> = ({ value }) => {
    let d: Date;
    if (value instanceof Date) {
      d = value;
    } else {
      d = new Date(value);
    }
    const safe = isNaN(d.getTime()) ? null : d;
    return <span>{safe ? format(safe, "dd/MM/yyyy") : "-"}</span>;
  };

  return (
    <Container className="overflow-auto">
      <div className="flex flex-col gap-6 pb-6 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">{student.nome}</CardTitle>
            <div className="flex flex-col gap-2 justify-end">
              <StudentDialog
                student={student}
                onSuccess={handleStudentUpdated}
                trigger={
                  <Button variant="outline">
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
              <BirthDate value={student.data_nascimento} />
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

        <BodyMeasurementSection student={student} onDataChanged={handleStudentUpdated} />
        <PhysicalTestSection student={student} onDataChanged={handleStudentUpdated} />
      </div>
    </Container>
  );
};
