// src/context/classroom/useClassroomContext.ts
import { useContext } from "react";
import { ClassroomContext } from "./ClassroomContext";

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error(
      "useClassroomContext must be used within a ClassroomProvider"
    );
  }
  return context;
};
