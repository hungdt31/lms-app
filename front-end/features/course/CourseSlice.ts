import Course from "@/lib/axios/course";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";

export const fetch_all_course = createAsyncThunk('course/get-all-course',async(__, {rejectWithValue}) => {
  const response : any = await Course.GetAllCourse()
  // console.log(response)
  if (!response?.success) return rejectWithValue(response)
  return response
})

// Initial state
interface CourseState {
  data:  {
    course: Array<any>
  }
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  loading: boolean
}

const initialState: CourseState = {
  data: {
    course: []
  },
  status: 'idle',
  loading: false
};

const CourseSlice = createSlice({
  name: 'course',
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle status state as needed
    builder
      .addCase(fetch_all_course.pending, (state, action : any) => {
        state.status = 'pending'
        state.loading = true
      })
      .addCase(fetch_all_course.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        state.data.course = action.payload?.data
        // console.log(action.payload)
      })
      .addCase(fetch_all_course.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = true
      });
  },
})
export default CourseSlice.reducer
