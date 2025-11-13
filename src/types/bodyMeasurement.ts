import type { Student } from "./student";

export interface BodyMeasurement {
  id: string;
  estudante: Student;
  data_coleta: Date;
  cintura: number;
  peso: number;
  estatura: number;
  imc: number;
  referencia_imc: string;
  relacao_cintura_estatura: number;
  referencia_relacao_cintura_estatura: string;
}
