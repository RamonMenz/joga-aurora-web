import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Header } from "@/components/common/header";
import { PageLoader } from "@/components/common/page-loader";

const LoginPage = lazy(() => import("@/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const HomePage = lazy(() => import("@/pages/HomePage").then(m => ({ default: m.HomePage })));
const ClassroomsPage = lazy(() => import("@/pages/ClassroomsPage").then(m => ({ default: m.ClassroomsPage })));
const ClassroomDetailsPage = lazy(() => import("@/pages/ClassroomDetailsPage").then(m => ({ default: m.ClassroomDetailsPage })));
const StudentsPage = lazy(() => import("@/pages/StudentsPage").then(m => ({ default: m.StudentsPage })));
const StudentDetailsPage = lazy(() => import("@/pages/StudentDetailsPage").then(m => ({ default: m.StudentDetailsPage })));
const ReportsPage = lazy(() => import("@/pages/ReportsPage").then(m => ({ default: m.ReportsPage })));
const DocumentationPage = lazy(() => import("@/pages/DocumentationPage").then(m => ({ default: m.DocumentationPage })));

export const AppRouter: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-1 w-full h-full pt-17 items-center justify-center">
        <Suspense fallback={<PageLoader message="Carregando página..." />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/turmas" element={<ClassroomsPage />} />
              <Route path="/turmas/:id" element={<ClassroomDetailsPage />} />
              <Route path="/estudantes" element={<StudentsPage />} />
              <Route path="/estudantes/:id" element={<StudentDetailsPage />} />
              <Route path="/relatorios" element={<ReportsPage />} />
              <Route path="/saiba-mais" element={<DocumentationPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};
