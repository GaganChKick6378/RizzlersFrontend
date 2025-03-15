// src/redux/dataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../interfaces/student.interface';
import { StudentState } from '../interfaces/studentState.interface';

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
};

// Create the thunk for fetching students
export const fetchStudents = createAsyncThunk<Student[], void, { rejectValue: string }>(
  'data/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/students`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        return rejectWithValue(`HTTP error! status: ${response.status}`);
      }
      
      const data: Student[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch students');
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // You can add non-async reducers here if needed.
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<Student[]>) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default dataSlice.reducer;
