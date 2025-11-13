import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  // Normalize values to ensure the control always renders at least one page
  const totalPagesNum = Number(totalPages);
  const currentPageNum = Number(currentPage);
  const safeTotalPages = Number.isFinite(totalPagesNum) && totalPagesNum > 0 ? totalPagesNum : 1;
  const safeCurrentPage =
    Number.isFinite(currentPageNum) && currentPageNum >= 0 && currentPageNum < safeTotalPages
      ? currentPageNum
      : 0;

  const canPrev = safeCurrentPage > 0;
  const canNext = safeCurrentPage < safeTotalPages - 1;

  return (
    <div className="flex items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex" />
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Linhas por página
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Página {safeCurrentPage + 1} de {safeTotalPages}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(0)}
            disabled={!canPrev}
            aria-label="Go to first page"
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(Math.max(0, safeCurrentPage - 1))}
            disabled={!canPrev}
            aria-label="Go to previous page"
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageChange(Math.min(safeTotalPages - 1, safeCurrentPage + 1))}
            disabled={!canNext}
            aria-label="Go to next page"
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageChange(safeTotalPages - 1)}
            disabled={!canNext}
            aria-label="Go to last page"
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
