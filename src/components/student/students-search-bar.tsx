import type { FormEvent } from "react";
import type { UseFormRegister } from "react-hook-form";
import type { StudentFilter } from "@/types/studentFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface StudentsSearchBarProps {
  formId: string;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<StudentFilter>;
}

export function StudentsSearchBar({ formId, onSubmit, register }: StudentsSearchBarProps) {
  return (
    <form id={formId} onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Input id="nome" placeholder="Pesquisar por nome..." className="flex-1" aria-label="Pesquisar por nome" {...register("nome")} />
      <Button type="submit">Pesquisar</Button>
    </form>
  );
}
