import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/common/container";
import { AttendancesReport } from "@/components/reports/attendances-report";
import { StudentsReport } from "@/components/reports/students-report";

export function ReportsPage() {
  return (
    <Container className="px-2">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <Tabs defaultValue="attendances" className="w-full max-w-[400px]">
        <TabsList>
          <TabsTrigger value="attendances">Presenças</TabsTrigger>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
        </TabsList>
        <TabsContent value="attendances">
          <AttendancesReport />
        </TabsContent>
        <TabsContent value="students">
          <StudentsReport />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
