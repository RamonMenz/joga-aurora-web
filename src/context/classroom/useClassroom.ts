import { useContext } from "react";
import { ClassroomsContext } from "./ClassroomContext";

export const useClassrooms = () => {
  const context = useContext(ClassroomsContext);
  if (!context) {
    throw new Error("useClassrooms must be used within a ClassroomsProvider");
  }
  return context;
};

export default useClassrooms;
