import type { BodyMeasurement } from "./bodyMeasurement";
import type { PhysicalTest } from "./physicalTest";
import type { Classroom } from "./classroom";

export type Gender = "Masculino" | "Feminino" | "Não informado";
export type RequestGender = "M" | "F" | "N";
export const GENDERS = ["Masculino", "Feminino", "Não informado"] as Gender[];

export interface Student {
  id: string;
  nome: string;
  data_nascimento: Date;
  genero: Gender | RequestGender;
  medidas_corporais: BodyMeasurement[];
  testes_fisicos: PhysicalTest[];
  turma: Classroom;
}
