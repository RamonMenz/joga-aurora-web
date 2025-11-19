import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircleIcon } from "lucide-react";
import { PhysicalTestDialog } from "./physical-test-dialog";
import { DeletePhysicalTestDialog } from "./delete-physical-test-dialog";
import type { Student } from "@/types/student";
import { format } from "date-fns";

interface PhysicalTestSectionProps {
  student: Student;
  onDataChanged: () => void;
}

export const PhysicalTestSection: React.FC<PhysicalTestSectionProps> = ({
  student,
  onDataChanged,
}) => {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Testes Físicos</h2>
        <PhysicalTestDialog
          student={student}
          onPhysicalTestChange={onDataChanged}
        >
          <Button size="icon">
            <PlusCircleIcon />
          </Button>
        </PhysicalTestDialog>
      </div>
      {student.testes_fisicos && student.testes_fisicos.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {student.testes_fisicos.map((teste) => (
              <CarouselItem
                key={teste.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>
                          Coleta de{" "}
                          {format(
                            JSON.stringify(teste.data_coleta),
                            "dd/MM/yyyy"
                          )}
                        </span>
                        <div className="flex gap-2">
                          <PhysicalTestDialog
                            student={student}
                            physicalTest={teste}
                            onPhysicalTestChange={onDataChanged}
                          >
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </PhysicalTestDialog>
                          <DeletePhysicalTestDialog
                            physicalTestId={teste.id}
                            onPhysicalTestDeleted={onDataChanged}
                          />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>6 Minutos:</strong> {teste.teste_seis_minutos} (
                        {teste.referencia_seis_minutos})
                      </p>
                      <p>
                        <strong>Flexibilidade:</strong> {teste.teste_flex} (
                        {teste.referencia_flex})
                      </p>
                      <p>
                        <strong>RML:</strong> {teste.teste_rml} (
                        {teste.referencia_rml})
                      </p>
                      <p>
                        <strong>20 Metros:</strong> {teste.teste_vinte_metros} (
                        {teste.referencia_vinte_metros})
                      </p>
                      <p>
                        <strong>Arremesso 2kg:</strong>{" "}
                        {teste.teste_arremesso_dois_quilos} (
                        {teste.referencia_arremesso_dois_quilos})
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <p>Nenhum teste físico registrado.</p>
      )}
    </div>
  );
};
