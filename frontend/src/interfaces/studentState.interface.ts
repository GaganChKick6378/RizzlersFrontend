import { Student } from "./student.interface";

export interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
}
