import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../interfaces/student.interface';

const initialState: Student[] = [];

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setStudents: (_state, action: PayloadAction<Student[]>) => {
      return action.payload;
    },
  },
});

export const { setStudents } = studentSlice.actions;
export default studentSlice.reducer;
