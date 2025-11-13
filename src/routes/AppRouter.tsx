import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Header } from "@/components/common/header";

// Páginas
import { LoginPage } from "@/pages/LoginPage";
import { HomePage } from "@/pages/HomePage";
import { ClassroomsPage } from "@/pages/ClassroomsPage";
import { ClassroomDetailsPage } from "@/pages/ClassroomDetailsPage";
import { StudentsPage } from "@/pages/StudentsPage";
import { StudentDetailsPage } from "@/pages/StudentDetailsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { ClassroomProvider } from "@/context/classroom/ClassroomProvider";

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex flex-1 w-full h-full pt-17 items-center justify-center">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Privadas */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/turmas" element={<ClassroomsPage />} />
              <Route
                path="/turmas/:id"
                element={
                  <ClassroomProvider>
                    <ClassroomDetailsPage />
                  </ClassroomProvider>
                }
              />
              <Route path="/estudantes" element={<StudentsPage />} />
              <Route path="/estudantes/:id" element={<StudentDetailsPage />} />
              <Route
                path="/relatorios"
                element={
                  <ClassroomProvider>
                    <ReportsPage />
                  </ClassroomProvider>
                }
              />
            </Route>

            {/* Rota padrão redireciona para / */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
