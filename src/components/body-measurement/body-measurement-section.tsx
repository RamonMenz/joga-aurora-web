import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircleIcon } from "lucide-react";
import { DeleteBodyMeasurementDialog } from "./delete-body-measurement-dialog";
import type { Student } from "@/types/student";
import { format } from "date-fns";
import { BodyMeasurementDialog } from "./body-measurement-dialog";

interface BodyMeasurementSectionProps {
  student: Student;
  onDataChanged: () => void;
}

export const BodyMeasurementSection: React.FC<BodyMeasurementSectionProps> = ({
  student,
  onDataChanged,
}) => {
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Medidas Corporais</h2>
        <BodyMeasurementDialog
          student={student}
          onBodyMeasurementChange={onDataChanged}
        >
          <Button size="icon">
            <PlusCircleIcon />
          </Button>
        </BodyMeasurementDialog>
      </div>
      {student.medidas_corporais && student.medidas_corporais.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {student.medidas_corporais.map((medida) => (
              <CarouselItem
                key={medida.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex justify-between items-center">
                        <span>
                          Coleta de{" "}
                          {format(
                            JSON.stringify(medida.data_coleta),
                            "dd/MM/yyyy"
                          )}
                        </span>
                        <div className="flex gap-2">
                          <BodyMeasurementDialog
                            student={student}
                            bodyMeasurement={medida}
                            onBodyMeasurementChange={onDataChanged}
                          >
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </BodyMeasurementDialog>
                          <DeleteBodyMeasurementDialog
                            bodyMeasurementId={medida.id}
                            onBodyMeasurementDeleted={onDataChanged}
                          />
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Peso:</strong> {medida.peso} kg
                      </p>
                      <p>
                        <strong>Estatura:</strong> {medida.estatura} cm
                      </p>
                      <p>
                        <strong>Cintura:</strong> {medida.cintura} cm
                      </p>
                      <p>
                        <strong>IMC:</strong> {medida.imc.toFixed(2)} (
                        {medida.referencia_imc})
                      </p>
                      <p>
                        <strong>RCE:</strong>{" "}
                        {medida.relacao_cintura_estatura.toFixed(2)} (
                        {medida.referencia_relacao_cintura_estatura})
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <p>Nenhuma medida corporal registrada.</p>
      )}
    </div>
  );
};
