import type { Gender, RequestGender } from "@/types/student";

export const GENDERS: { value: RequestGender; label: Gender }[] = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" },
  { value: "N", label: "Não informado" },
];

export const toFrontendGender = (gender: RequestGender): Gender => {
  switch (gender) {
    case "M":
      return "Masculino";
    case "F":
      return "Feminino";
    case "N":
      return "Não informado";
    default:
      return "Não informado";
  }
};

export const toBackendGender = (gender: Gender): RequestGender => {
  switch (gender) {
    case "Masculino":
      return "M";
    case "Feminino":
      return "F";
    case "Não informado":
      return "N";
    default:
      return "N";
  }
};
