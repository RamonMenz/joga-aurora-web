import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ClassroomsProvider } from "./context/classroom/ClassroomProvider";
import { AppRouter } from "./routes/AppRouter";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassroomsProvider>
          <AppRouter />
        </ClassroomsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
