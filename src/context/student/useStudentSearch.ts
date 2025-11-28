import { useContext } from "react";
import { StudentSearchContext } from "./StudentSearchContext";

export const useStudentSearch = () => {
  const ctx = useContext(StudentSearchContext);
  if (!ctx) throw new Error("useStudentSearch must be used within StudentSearchProvider");
  return ctx;
};

export default useStudentSearch;
