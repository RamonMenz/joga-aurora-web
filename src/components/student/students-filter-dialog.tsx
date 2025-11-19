import { useState, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Controller,
  type Control,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import type { StudentFilter } from "@/types/studentFilter";
import type { Classroom } from "@/types/classroom";
import { GENDERS } from "@/util/gender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface StudentsFilterDialogProps {
  trigger: ReactNode;
  control: Control<StudentFilter>;
  watch: UseFormWatch<StudentFilter>;
  setValue: UseFormSetValue<StudentFilter>;
  classrooms: Classroom[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClear: () => void;
  formId: string;
}

export function StudentsFilterDialog({
  trigger,
  control,
  watch,
  setValue,
  classrooms,
  open,
  onOpenChange,
  onClear,
  formId,
}: StudentsFilterDialogProps) {
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const from = watch("data_nascimento_ini");
  const to = watch("data_nascimento_fim");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros avançados</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block">Nascimento (período)</Label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <Label className="mb-1 block" htmlFor="data_nascimento_ini">
                  Início
                </Label>
                <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {from ? (
                        <span>
                          {format(from, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span>Selecione a data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={from}
                      captionLayout="dropdown"
                      locale={ptBR}
                      onSelect={(date) => {
                        setValue("data_nascimento_ini", date ?? undefined, {
                          shouldDirty: true,
                        });
                        if (date && to && to < date) {
                          setValue("data_nascimento_fim", undefined, {
                            shouldDirty: true,
                          });
                        }
                        setIsFromOpen(false);
                      }}
                      disabled={(date) => (to ? date > to : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="mb-1 block" htmlFor="data_nascimento_fim">
                  Fim
                </Label>
                <Popover open={isToOpen} onOpenChange={setIsToOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {to ? (
                        <span>
                          {format(to, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      ) : (
                        <span>Selecione a data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={to}
                      captionLayout="dropdown"
                      locale={ptBR}
                      onSelect={(date) => {
                        setValue("data_nascimento_fim", date ?? undefined, {
                          shouldDirty: true,
                        });
                        if (date && from && date < from) {
                          setValue("data_nascimento_ini", undefined, {
                            shouldDirty: true,
                          });
                        }
                        setIsToOpen(false);
                      }}
                      disabled={(date) => (from ? date < from : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="genero">Gênero</Label>
            <Controller
              name="genero"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "all" ? undefined : value)
                  }
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="turma_id">Turma</Label>
            <Controller
              name="turma_id"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === "all" ? undefined : value)
                  }
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {classrooms.map((classroom) => (
                      <SelectItem key={classroom.id} value={classroom.id}>
                        {classroom.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClear}>
            Limpar
          </Button>
          <Button type="submit" form={formId}>
            Pesquisar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
