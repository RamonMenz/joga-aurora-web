import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/common/container";
import { AttendancesReport } from "@/components/reports/attendances-report";

export function ReportsPage() {
  return (
    <Container className="px-2">
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <Tabs defaultValue="attendances" className="w-full max-w-[400px]">
        <TabsList>
          <TabsTrigger value="attendances">Presenças</TabsTrigger>
          <TabsTrigger value="development">Medidas e Testes</TabsTrigger>
        </TabsList>
        <TabsContent value="attendances">
          <AttendancesReport />
        </TabsContent>
        <TabsContent value="development">
          <div className="flex items-center justify-center h-72">
            <p className="text-gray-500">Em desenvolvimento...</p>
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
