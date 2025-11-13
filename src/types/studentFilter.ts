export type StudentFilter = {
  nome?: string;
  data_nascimento_ini?: Date;
  data_nascimento_fim?: Date;
  genero?: "M" | "F" | "N";
  turma_id?: string;
};
