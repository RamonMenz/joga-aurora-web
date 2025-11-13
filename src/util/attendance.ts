import type {
  AttendanceStatus,
  RequestAttendanceStatus,
} from "@/types/attendance";

export const toFrontendStatus = (
  status: RequestAttendanceStatus
): AttendanceStatus => {
  switch (status) {
    case "P":
      return "Presente";
    case "L":
      return "Atrasado";
    case "A":
      return "Ausente";
    default:
      return "Presente";
  }
};

export const toBackendStatus = (
  status: AttendanceStatus
): RequestAttendanceStatus => {
  switch (status) {
    case "Presente":
      return "P";
    case "Atrasado":
      return "L";
    case "Ausente":
      return "A";
  }
};
