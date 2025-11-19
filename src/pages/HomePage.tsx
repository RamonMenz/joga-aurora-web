import { Container } from "@/components/common/container";
import { HomeCard } from "@/components/home/home-card";
import { FileText, Users, GraduationCap, Book } from "lucide-react";
import { ROUTES } from "@/util/constants";

export const HomePage: React.FC = () => {
  return (
    <Container>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
        <HomeCard
          to={ROUTES.CLASSROOMS}
          icon={<Users className="w-12 h-12 text-blue-500" />}
          title="Turmas"
        />
        <HomeCard
          to={ROUTES.STUDENTS}
          icon={<GraduationCap className="w-12 h-12 text-purple-500" />}
          title="Estudantes"
        />
        <HomeCard
          to={ROUTES.REPORTS}
          icon={<FileText className="w-12 h-12 text-green-500" />}
          title="Relatórios"
        />
        <HomeCard
          to={ROUTES.SAIBA_MAIS}
          icon={<Book className="w-12 h-12 text-orange-500" />}
          title="Saiba Mais"
        />
      </div>
    </Container>
  );
};
