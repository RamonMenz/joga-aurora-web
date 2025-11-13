import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { reportService } from "@/api/services/reportService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import classroomService from "@/api/services/classroomService";
import type { Classroom } from "@/types/classroom";

export function AttendancesReport() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<
    string | undefined
  >();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = () => {
    classroomService
      .getAll({ page: 0, size: 100 })
      .then((data) => setClassrooms(data.content));
  };

  const handleDownload = async () => {
    if (!selectedClassroomId || !startDate || !endDate) {
      toast.error("Selecione a turma e o período para gerar o relatório.");
      return;
    }

    try {
      const response = await reportService.getAttendancesReport(
        selectedClassroomId,
        startDate,
        endDate
      );
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Erro ao gerar o relatório de presenças:", error);
      toast.error("Erro ao gerar o relatório de presenças.");
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Relatório de Presenças</h2>
      <div className="flex flex-col gap-4 items-center mb-4">
        <Select
          onValueChange={setSelectedClassroomId}
          value={selectedClassroomId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {classrooms.map((classroom) => (
              <SelectItem key={classroom.id} value={classroom.id}>
                {classroom.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? (
                format(startDate, "PPP", { locale: ptBR })
              ) : (
                <span>Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              locale={ptBR}
              selected={startDate}
              onSelect={setStartDate}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(endDate, "PPP", { locale: ptBR })
              ) : (
                <span>Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              locale={ptBR}
              selected={endDate}
              onSelect={setEndDate}
            />
          </PopoverContent>
        </Popover>
        <Button
          onClick={handleDownload}
          disabled={!selectedClassroomId || !startDate || !endDate}
          className="w-full max-w-auto"
        >
          Baixar Relatório
        </Button>
      </div>
    </div>
  );
}
