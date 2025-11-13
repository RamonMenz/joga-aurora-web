import type { Student } from "./student";

export interface Classroom {
  id: string;
  nome: string;
  chamada_feita: boolean;
  estudantes: Student[];
  presences: number;
  absences: number;
}

export interface ClassroomSimple {
  id: string;
  turma: string;
}
