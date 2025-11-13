import type { Student } from "./student";

export interface PhysicalTest {
  id: string;
  estudante: Student;
  data_coleta: Date;
  teste_seis_minutos: number;
  referencia_seis_minutos: string;
  teste_flex: number;
  referencia_flex: string;
  teste_rml: number;
  referencia_rml: string;
  teste_vinte_metros: number;
  referencia_vinte_metros: string;
  teste_arremesso_dois_quilos: number;
  referencia_arremesso_dois_quilos: string;
}
