/**
 * Constantes globais da aplicação
 */

export const APP_CONFIG = {
  NAME: 'Joga Aurora',
  VERSION: '1.0.0',
} as const;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  TIMEOUT: 30000,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  CLASSROOMS: '/turmas',
  CLASSROOM_DETAILS: (id: string) => `/turmas/${id}`,
  STUDENTS: '/estudantes',
  STUDENT_DETAILS: (id: string) => `/estudantes/${id}`,
  REPORTS: '/relatorios',
  SAIBA_MAIS: '/saiba-mais',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    ME: '/client/me',
  },
  STUDENTS: {
    BASE: '/estudante',
    BY_ID: (id: string) => `/estudante/${id}`,
  },
  CLASSROOMS: {
    BASE: '/turma',
    BY_ID: (id: string) => `/turma/${id}`,
  },
  ATTENDANCE: {
    BASE: '/presenca',
  },
  BODY_MEASUREMENTS: {
    BASE: '/medidas-corporais',
  },
  PHYSICAL_TESTS: {
    BASE: '/testes-fisicos',
  },
  REPORTS: {
    BASE: '/relatorios',
  },
} as const;

export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 256,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
  },
  CLASSROOM_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 32,
  },
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login realizado com sucesso!',
    LOGOUT: 'Logout realizado com sucesso!',
    STUDENT_CREATED: 'Estudante criado com sucesso!',
    STUDENT_UPDATED: 'Estudante atualizado com sucesso!',
    STUDENT_DELETED: 'Estudante removido com sucesso!',
    CLASSROOM_CREATED: 'Turma criada com sucesso!',
    CLASSROOM_UPDATED: 'Turma atualizada com sucesso!',
    CLASSROOM_DELETED: 'Turma removida com sucesso!',
    ATTENDANCE_SAVED: 'Presença registrada com sucesso!',
    ATTENDANCE_UPDATED: 'Presença atualizada com sucesso!',
  },
  ERROR: {
    LOGIN: 'Erro ao realizar login.',
    LOGOUT: 'Erro ao realizar logout.',
    UNAUTHORIZED: 'Usuário ou senha incorretos.',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
    GENERIC: 'Ocorreu um erro. Tente novamente.',
    STUDENT_CREATE: 'Erro ao criar estudante.',
    STUDENT_UPDATE: 'Erro ao atualizar estudante.',
    STUDENT_DELETE: 'Erro ao remover estudante.',
    CLASSROOM_CREATE: 'Erro ao criar turma.',
    CLASSROOM_UPDATE: 'Erro ao atualizar turma.',
    CLASSROOM_DELETE: 'Erro ao remover turma.',
    ATTENDANCE_SAVE: 'Erro ao salvar presença.',
  },
  LOADING: {
    LOGIN: 'Verificando credenciais...',
    LOADING: 'Carregando...',
    SAVING: 'Salvando...',
    DELETING: 'Removendo...',
    CREATING: 'Criando...',
    UPDATING: 'Atualizando...',
  },
} as const;

export const EMPTY_STATES = {
  NO_STUDENTS: 'Nenhum estudante encontrado.',
  NO_CLASSROOMS: 'Nenhuma turma encontrada.',
  NO_RESULTS: 'Nenhum resultado encontrado.',
} as const;
