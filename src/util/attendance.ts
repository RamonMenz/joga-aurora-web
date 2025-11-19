import type { AttendanceStatus, RequestAttendanceStatus } from "@/types/attendance";

// Mapeia código do backend (P/L/A) para label de UI
export const toFrontendStatus = (status: RequestAttendanceStatus): AttendanceStatus => {
  switch (status) {
    case "P":
      return "Presente";
    case "L":
      return "Atrasado";
    case "A":
      return "Ausente";
    default:
      return "Presente"; // fallback seguro
  }
};

// Mapeia label de UI para código esperado pelo backend
export const toBackendStatus = (status: AttendanceStatus): RequestAttendanceStatus => {
  switch (status) {
    case "Presente":
      return "P";
    case "Atrasado":
      return "L";
    case "Ausente":
      return "A";
    default:
      return "P"; // fallback evita undefined
  }
};
