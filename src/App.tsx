import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ClassroomsProvider } from "./context/classroom/ClassroomProvider";
import { StudentSearchProvider } from "./context/student/StudentSearchProvider";
import { AppRouter } from "./routes/AppRouter";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassroomsProvider>
          <StudentSearchProvider>
            <AppRouter />
          </StudentSearchProvider>
        </ClassroomsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
