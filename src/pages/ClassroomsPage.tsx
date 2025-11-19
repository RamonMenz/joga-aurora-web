import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import classroomService from "@/api/services/classroomService";
import { useClassrooms } from "@/context/classroom/useClassroom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import { VALIDATION, TOAST_MESSAGES, ROUTES } from "@/util/constants";

const formSchema = z.object({
  nome: z
    .string()
    .min(VALIDATION.CLASSROOM_NAME.MIN_LENGTH, "O nome da turma é obrigatório")
    .max(
      VALIDATION.CLASSROOM_NAME.MAX_LENGTH,
      `O nome da turma deve ter no máximo ${VALIDATION.CLASSROOM_NAME.MAX_LENGTH} caracteres`
    ),
});

type FormValues = z.infer<typeof formSchema>;

export const ClassroomsPage: React.FC = () => {
  const { classrooms, loadClassrooms } = useClassrooms();
  const [selectedClassroom, setSelectedClassroom] = useState<string>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleNavigate = useCallback(() => {
    if (selectedClassroom) {
      navigate(ROUTES.CLASSROOM_DETAILS(selectedClassroom));
    }
  }, [selectedClassroom, navigate]);

  const onSubmit = useCallback(async (data: FormValues) => {
    toast.promise(classroomService.insert(data.nome), {
      loading: TOAST_MESSAGES.LOADING.CREATING,
      success: (newClassroom) => {
        void loadClassrooms();
        navigate(ROUTES.CLASSROOM_DETAILS(newClassroom.id));
        return TOAST_MESSAGES.SUCCESS.CLASSROOM_CREATED;
      },
      error: (error) => {
        return error.response?.data?.message || TOAST_MESSAGES.ERROR.CLASSROOM_CREATE;
      },
    });
  }, [loadClassrooms, navigate]);

  return (
    <Container className="px-2">
      <h1 className="text-2xl font-bold mb-4">Turmas</h1>

      <Tabs defaultValue="select" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="select">Selecionar Turma</TabsTrigger>
          <TabsTrigger value="create">Criar Turma</TabsTrigger>
        </TabsList>
        <TabsContent value="select">
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Turma</CardTitle>
              <CardDescription>
                Selecione uma turma para ver os detalhes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={setSelectedClassroom}
                  value={selectedClassroom}
                >
                  <SelectTrigger aria-label="Selecionar turma">
                    <SelectValue placeholder="Selecione uma turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Turmas</SelectLabel>
                      {classrooms.map((classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNavigate} disabled={!selectedClassroom}>
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Turma</CardTitle>
              <CardDescription>
                Crie uma nova turma para adicionar alunos.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-1.5"
            >
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="nome">Nome da Turma</Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    placeholder="Ex: Terceiro Ano"
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? "nome-error" : undefined}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">
                      {errors.nome.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                  {isSubmitting ? TOAST_MESSAGES.LOADING.CREATING : "Criar Turma"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};
