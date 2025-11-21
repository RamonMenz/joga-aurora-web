import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Header } from "@/components/common/header";
import { PageLoader } from "@/components/common/page-loader";
import { ROUTES } from "@/util/constants";

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
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.CLASSROOMS} element={<ClassroomsPage />} />
              <Route path={ROUTES.CLASSROOM_DETAILS(':id')} element={<ClassroomDetailsPage />} />
              <Route path={ROUTES.STUDENTS} element={<StudentsPage />} />
              <Route path={ROUTES.STUDENT_DETAILS(':id')} element={<StudentDetailsPage />} />
              <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
              <Route path={ROUTES.SAIBA_MAIS} element={<DocumentationPage />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
};
