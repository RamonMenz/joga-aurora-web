import { useContext } from "react";
import { StudentSearchContext } from "./StudentSearchContext";

export const useStudentSearch = () => {
  const context = useContext(StudentSearchContext);
  if (!context) throw new Error("useStudentSearch must be used within StudentSearchProvider");
  return context;
};

export default useStudentSearch;
