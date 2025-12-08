import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthProvider";
import { ClassroomsProvider } from "./context/classroom/ClassroomProvider";
import { StudentSearchProvider } from "./context/student/StudentSearchProvider";
import { AppRouter } from "./routes/AppRouter";
import { CookieConsentBanner } from "./components/common/cookie-consent-banner";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClassroomsProvider>
          <StudentSearchProvider>
            <AppRouter />
            <CookieConsentBanner />
          </StudentSearchProvider>
        </ClassroomsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
