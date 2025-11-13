import { useEffect, useState } from "react";
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
import type { Classroom } from "@/types/classroom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";

const formSchema = z.object({
  nome: z
    .string()
    .min(1, "O nome da turma é obrigatório")
    .max(32, "O nome da turma deve ter no máximo 32 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export const ClassroomsPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<string>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = () => {
    classroomService
      .getAll({ page: 0, size: 100 })
      .then((data) => setClassrooms(data.content));
  };

  const handleNavigate = () => {
    if (selectedClassroom) {
      navigate(`/turmas/${selectedClassroom}`);
    }
  };

  const onSubmit = async (data: FormValues) => {
    toast.promise(classroomService.insert(data.nome), {
      loading: "Criando turma...",
      success: (newClassroom) => {
        navigate(`/turmas/${newClassroom.id}`);
        return "Turma criada com sucesso!";
      },
      error: (error) => {
        return error.response?.data?.message || "Erro ao criar turma.";
      },
    });
  };

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
                  <SelectTrigger>
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
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">
                      {errors.nome.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando..." : "Criar Turma"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
};
