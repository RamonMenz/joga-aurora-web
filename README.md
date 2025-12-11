# Joga Aurora Web

Aplicação web em React utilizada pelo projeto social Joga Aurora para gestão de turmas, estudantes, presença em aula e acompanhamento do desenvolvimento físico (medidas corporais e testes físicos) nas atividades educacionais e esportivas do projeto.

## 1. Visão Geral do Projeto

O **Joga Aurora Web** é o frontend do sistema do projeto social Joga Aurora, voltado à equipe pedagógica e esportiva do projeto, que precisa:

- Organizar **turmas** e **estudantes**;
- Registrar e revisar **presenças em aula**;
- Controlar **medidas corporais** e **testes físicos** dos estudantes;
- Gerar **relatórios** consolidados por turma e período.

O sistema centraliza essas informações em uma interface única, responsiva e amigável, facilitando o acompanhamento da evolução dos estudantes ao longo do tempo.

### Problema que o projeto resolve

No contexto do projeto social Joga Aurora — assim como em muitos ambientes escolares e esportivos — os registros de presença, avaliações físicas e dados dos estudantes frequentemente ficam espalhados em planilhas, papéis ou sistemas genéricos. Isso dificulta:

- A visualização rápida da situação de uma turma;
- O histórico de evolução física de cada estudante;
- A geração de relatórios por período e por turma.

O Joga Aurora Web concentra esses fluxos em um painel único e integrado ao backend da plataforma do projeto, permitindo um acompanhamento mais seguro, organizado e eficiente.

### Principais funcionalidades

- **Autenticação de usuários** (login/logout) integrada ao backend;
- **Gestão de turmas**: criação, listagem, edição e remoção de turmas;
- **Gestão de estudantes**:
  - Cadastro, edição e exclusão de estudantes;
  - Busca por nome;
  - Filtros avançados (turma, data de nascimento, gênero, etc.);
- **Presença**:
  - Registro e edição de presença por turma (status: Presente, Atrasado, Ausente);
  - Visualização da chamada já registrada;
- **Medidas corporais**:
  - Registro de cintura, peso, estatura e data de coleta por estudante;
  - Visualização do histórico associado ao estudante;
- **Testes físicos**:
  - Registro de testes como 6 minutos, Flex, RML, 20 metros e Arremesso 2 kg;
  - Associação direta ao estudante, com histórico de coletas;
- **Relatórios**:
  - Relatório de presenças por turma e intervalo de datas;
  - Relatório de estudantes por turma e intervalo de datas (exportados como arquivo `blob`, ex.: planilhas ou PDFs);
- **Tema claro/escuro** com preferência persistida no navegador;
- **Consentimento de cookies** para habilitar o uso de cookies de autenticação;
- **Documentação embutida** em uma página "Saiba Mais" com guia de uso para usuários finais.


## 2. Arquitetura e Tecnologias Utilizadas

### Stack principal

- **Linguagem**: TypeScript
- **Framework de UI**: React 19 (SPA)
- **Bundler / Dev Server**: Vite 7
- **Roteamento**: `react-router-dom` 7
- **Estilização**: Tailwind CSS 4 + componentes baseados em Radix UI
- **Formulários e validação**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Requisições HTTP**: `axios`
- **Estado de contexto**: Context API do React (Auth, Turmas, Busca de Estudantes, Tema)
- **Ícones**: `lucide-react`, `@phosphor-icons/react`
- **Notificações**: `sonner`

## 3. Estrutura da Codebase

Estrutura simplificada do projeto:

```text
root
├── public/                  # Arquivos estáticos públicos
├── src/
│   ├── api/
│   │   ├── axios.ts         # Instância Axios com interceptors e baseURL
│   │   └── services/        # Serviços de acesso à API (auth, turma, estudante etc.)
│   ├── assets/              # Imagens e recursos estáticos (se aplicável)
│   ├── components/
│   │   ├── body-measurement/ # Diálogos e seções de medidas corporais
│   │   ├── classroom/        # Cabeçalho e diálogos de turma
│   │   ├── common/           # Componentes reutilizáveis (header, container, loader, banner de cookies)
│   │   ├── home/             # Cards da página inicial
│   │   ├── physical-test/    # Diálogos e seções de testes físicos
│   │   ├── reports/          # Formulários/fluxos de geração de relatórios
│   │   ├── student/          # Tabelas, diálogos e filtros de estudantes
│   │   └── ui/               # Biblioteca de componentes UI (botão, input, dialog, tabs, etc.)
│   ├── context/
│   │   ├── auth/             # `AuthProvider` e hook `useAuth` (login, logout, usuário)
│   │   ├── classroom/        # `ClassroomsProvider` e hook `useClassrooms`
│   │   ├── student/          # `StudentSearchProvider` e hook `useStudentSearch`
│   │   └── theme/            # `ThemeProvider` e contexto de tema (light/dark/system)
│   ├── hooks/
│   │   └── useCookieConsent.ts # Hook para controle de consentimento de cookies
│   ├── lib/                  # Utilitários gerais (ex.: `utils.ts`)
│   ├── pages/
│   │   ├── HomePage.tsx          # Página inicial (atalhos para áreas principais)
│   │   ├── LoginPage.tsx         # Tela de login
│   │   ├── ClassroomsPage.tsx    # Listagem/criação de turmas
│   │   ├── ClassroomDetailsPage.tsx # Detalhes da turma e registro de presença
│   │   ├── StudentsPage.tsx      # Busca e filtros de estudantes
│   │   ├── StudentDetailsPage.tsx# Detalhes do estudante, medidas e testes físicos
│   │   ├── ReportsPage.tsx       # Geração de relatórios
│   │   └── DocumentationPage.tsx # Página "Saiba Mais" (documentação para usuários)
│   ├── routes/
│   │   ├── AppRouter.tsx     # Definição de rotas públicas e privadas
│   │   └── PrivateRoute.tsx  # Proteção de rotas autenticadas
│   ├── types/                # Tipos TypeScript para domínio e paginação
│   ├── util/                 # Funções utilitárias (datas, gênero, presença, arquivos, constantes)
│   ├── App.tsx               # Composição de provedores e roteador principal
│   ├── main.tsx              # Ponto de entrada, ThemeProvider e ErrorBoundary
│   └── index.css             # Estilos globais e integrações com Tailwind
├── index.html                # HTML base da SPA
├── vite.config.ts            # Configuração do Vite (plugins, alias, build)
├── tailwind.config.ts        # Configuração do Tailwind CSS
├── tsconfig*.json            # Configuração TypeScript
├── eslint.config.js          # Regras de lint
└── vercel.json               # Configuração de rewrites para deploy na Vercel
```

## 4. Como Executar o Projeto

### 4.1. Pré-requisitos

- **Node.js**: versão 18+ (recomendado 20+);
- **npm**: versão compatível com o Node instalado;
- Backend da plataforma Joga Aurora em execução na URL desejada (ex.: `http://localhost:8080`).

### 4.2. Clonar o repositório

```bash
git clone https://github.com/RamonMenz/joga-aurora-web.git
cd joga-aurora-web
```

### 4.3. Instalar dependências

O projeto utiliza `npm` (há um `package-lock.json`).

```bash
npm install
```

### 4.4. Configurar variáveis de ambiente

O frontend lê a URL base da API a partir de `VITE_API_URL` em tempo de build.

1. Crie um arquivo `.env` na raiz do projeto (ou `.env.local`, conforme sua preferência):

   ```env
   VITE_API_URL=http://localhost:8080
   ```

2. Ajuste o valor para apontar para o backend real (produção, homologação, etc.).

Se a variável **não** estiver definida, o valor padrão será `http://localhost:8080`, conforme `API_CONFIG` em `src/util/constants.ts`.

### 4.5. Executar em modo desenvolvimento

Com as dependências instaladas e o backend rodando:

```bash
npm run dev
```

Por padrão, o Vite sobe na porta `3000` e abre o navegador automaticamente: `http://localhost:3000`.

### 4.6. Build de produção

Para gerar os artefatos otimizados de produção em `dist/`:

```bash
npm run build
```

Esse comando executa:

- `tsc -b` para checagem/compilação TypeScript;
- `vite build` para empacotar os assets.

## 5. Fluxo de Autenticação e Cookies

- O login é realizado via Basic Auth (`/login`) e o backend deve retornar os cookies de sessão.
- O frontend **só envia cookies** (`withCredentials`) após o usuário **aceitar o uso de cookies** no banner exibido no rodapé.
- O consentimento é armazenado em `localStorage` sob a chave `joga-aurora-cookie-consent`.
- Ao receber um **401 Unauthorized**, o interceptor de `axios` dispara um evento global para que o `AuthProvider` redirecione o usuário para a tela de login.

> Se o backend estiver rodando corretamente, mas o usuário não aceitar cookies, ações que dependem de autenticação não funcionarão como esperado.


## 6. Navegação Principal (Resumo para Usuários)

- **Login**: tela de autenticação inicial.
- **Home**: atalhos para Turmas, Estudantes, Relatórios e Saiba Mais.
- **Turmas**:
  - Aba "Selecionar Turma": escolhe uma turma existente e navega para seus detalhes.
  - Aba "Criar Turma": cadastra uma nova turma.
- **Detalhes da Turma**:
  - Lista de estudantes da turma;
  - Modo de registro/edição de presença;
  - Acesso aos detalhes individuais do estudante.
- **Estudantes**:
  - Botão "Adicionar estudante" para novo cadastro;
  - "Filtros avançados" (turma, datas, gênero, etc.);
  - Tabela com paginação e ajustes de tamanho de página.
- **Detalhes do Estudante**:
  - Dados básicos (nome, data de nascimento, gênero, turma);
  - Seções de Medidas Corporais e Testes Físicos com histórico e diálogos de cadastro/edição;
  - Ações de editar e excluir estudante.
- **Relatórios**:
  - Abas para Relatório de Presenças e Relatório de Estudantes;
  - Seleção de turma e intervalo de datas para download dos arquivos.
- **Saiba Mais**:
  - Página de documentação em formato de acordeão, com visão geral, fluxos passo a passo e dicas.
