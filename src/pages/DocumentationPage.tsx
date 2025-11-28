import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/common/container";
import { Book, Target, Compass, Layers, ListChecks, Lightbulb, HelpCircle } from "lucide-react";

interface SectionDef {
  key: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}

const sections: SectionDef[] = [
  {
    key: "introducao",
    icon: <Book className="h-5 w-5 text-primary" />,
    title: "1. Visão Geral",
    body: `O sistema ajuda a acompanhar turmas, estudantes, presença em aula e o desenvolvimento físico (medidas corporais e testes). Tudo organizado de maneira simples em um só lugar.`,
  },
  {
    key: "objetivo-publico",
    icon: <Target className="h-5 w-5 text-primary" />,
    title: "2. Para Quem É",
    body: `Destinado a quem gerencia turmas e precisa registrar presenças e acompanhar a evolução dos estudantes. Ideal para professores, instrutores ou coordenadores.`,
  },
  {
    key: "como-comecar",
    icon: <Compass className="h-5 w-5 text-primary" />,
    title: "3. Primeiro Acesso",
    body: `1. Vá até a tela de Login.\n2. Informe seu usuário e senha.\n3. Clique em Entrar para abrir a página inicial com os atalhos.\nSe já estiver logado e retornar ao login, será redirecionado para a página inicial.`,
  },
  {
    key: "navegacao",
    icon: <Layers className="h-5 w-5 text-primary" />,
    title: "4. Navegação",
    body: `Barra superior:\n- Sair: termina a sessão.\n- Tema: alterna claro/escuro.\n- Início: volta ao começo.\n- Voltar: retorna para a página anterior.\n\nPágina Inicial:\n- Turmas: listar ou criar turmas.\n- Estudantes: buscar e cadastrar.\n- Relatórios: gerar relatório de presença.\n- Saiba Mais: esta página.`,
  },
  {
    key: "funcionalidades",
    icon: <ListChecks className="h-5 w-5 text-primary" />,
    title: "5. Principais Funcionalidades",
    body: `Turmas:\n- Criar, abrir, renomear e excluir.\n\nPresença:\n- Registrar ou editar chamada (Presente, Atrasado, Ausente).\n\nEstudantes:\n- Adicionar, editar, excluir, buscar e filtrar.\n\nMedidas Corporais:\n- Registrar peso, estatura, cintura e data.\n\nTestes Físicos:\n- Registrar 6 minutos, Flex, RML, 20 metros e Arremesso 2kg.\n\nRelatórios:\n- Gerar relatório de presença ou estudantes de uma turma em um período.`,
  },
  {
    key: "fluxos",
    icon: <ListChecks className="h-5 w-5 text-primary" />,
    title: "6. Passo a Passo",
    body: `Nova Turma:\n1. Turmas > Criar Turma.\n2. Digite o nome e confirme.\n\nPresença:\n1. Abra a turma.\n2. Entrar em Registrar/Editar Presença.\n3. Ajuste os status e Salvar.\n\nNovo Estudante:\n1. Botão Adicionar Estudante.\n2. Preencha dados e Salvar.\n\nFiltrar Estudantes:\n1. Filtros Avançados.\n2. Defina critérios e Salvar.\n\nMedida Corporal:\n1. Detalhes do estudante.\n2. Adicionar medida > preencher > Salvar.\n\nTeste Físico:\n1. Detalhes do estudante.\n2. Adicionar teste > preencher > Salvar.\n\nRelatório:\n1. Relatórios.\n2. Escolha turma e período.\n3. Gerar.`,
  },
  {
    key: "dicas",
    icon: <Lightbulb className="h-5 w-5 text-primary" />,
    title: "7. Dicas Úteis",
    body: `- Tema claro ou escuro: escolha o mais confortável.\n- Revise datas ao salvar: base do histórico.\n- Erro na chamada? Abra de novo e edite.\n- Filtros aceleram buscas em listas grandes.\n- Exclusões são definitivas: confirme antes.`,
  },
  {
    key: "faq",
    icon: <HelpCircle className="h-5 w-5 text-primary" />,
    title: "8. Perguntas Frequentes",
    body: `Como renomear uma turma?\nAbra a turma e use o botão de edição.\n\nPosso desfazer exclusões?\nNão. São permanentes.\n\nGênero "Não informado" é permitido?\nSim, mas informar ajuda em relatórios.\n\nErro no login?\nConfira usuário e senha e tente de novo.`,
  },
];

export const DocumentationPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-background via-background to-muted/40">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_65%)]" />
      <Container className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Saiba Mais</h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Guia rápido e simples para você aproveitar todos os recursos.
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {sections.map(s => (
            <span key={s.key} className="text-xs rounded-full bg-primary/10 text-primary px-3 py-1 font-medium">
              {s.title.split(".")[0]}
            </span>
          ))}
        </div>
        <Accordion type="multiple" className="space-y-4 w-full">
          {sections.map(section => (
            <AccordionItem
              key={section.key}
              value={section.key}
              className="rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm transition hover:shadow-md w-full"
            >
              <AccordionTrigger className="px-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/15 text-primary">
                    {section.icon}
                  </div>
                  <span className="font-semibold text-sm md:text-base">{section.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 w-full">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line leading-relaxed w-full">
                  {section.body}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>Informações sujeitas a atualização. Utilize os recursos com responsabilidade.</p>
        </footer>
      </Container>
    </div>
  );
};

export default DocumentationPage;

