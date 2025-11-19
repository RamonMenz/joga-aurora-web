import { memo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Page } from "@/types/page";
import type { Student } from "@/types/student";
import { useNavigate } from "react-router-dom";
import { CustomPagination } from "../common/pagination";
import { Card } from "../ui/card";
import { EMPTY_STATES } from "@/util/constants";

interface StudentsSearchTableProps {
  studentsPage?: Page<Student>;
  onPaginate: (page: number) => void;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
}

export const StudentsSearchTable = memo<StudentsSearchTableProps>(function StudentsSearchTable({
  studentsPage,
  onPaginate,
  pageSize,
  onPageSizeChange,
}) {
  const navigate = useNavigate();

  const handleRowClick = useCallback((studentId: string) => {
    navigate(`/estudantes/${studentId}`);
  }, [navigate]);

  const hasData = !!studentsPage && studentsPage.content.length > 0;
  const totalPagesNormalized = studentsPage
    ? Math.max(1, Number(studentsPage.totalPages) || 1)
    : 1;
  const currentPageNormalized = studentsPage
    ? Number(studentsPage.number) || 0
    : 0;

  return (
    <Card>
      <div className="overflow-auto w-full p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turma</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasData ? (
              studentsPage!.content.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => handleRowClick(student.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>{student.nome}</TableCell>
                  <TableCell>{student.turma.nome}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-sm text-muted-foreground py-8">
                  {EMPTY_STATES.NO_STUDENTS}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {studentsPage && studentsPage.content.length > 0 && (
          <>
            <div className="mt-2 text-sm text-muted-foreground">
              {(() => {
                const total = Number(studentsPage.totalElements) || 0;
                const start = total > 0 ? studentsPage.number * studentsPage.size + 1 : 0;
                const end = total > 0 ? Math.min(total, (studentsPage.number + 1) * studentsPage.size) : 0;
                return (
                  <span>
                    Mostrando {start}-{end} de {total}
                  </span>
                );
              })()}
            </div>
            <div className="mt-4">
              <CustomPagination
                totalPages={totalPagesNormalized}
                currentPage={currentPageNormalized}
                pageSize={pageSize}
                onPageChange={onPaginate}
                onPageSizeChange={onPageSizeChange}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
});
