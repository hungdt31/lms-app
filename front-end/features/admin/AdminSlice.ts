import User from "@/lib/axios/user";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
export const fetch_all_user = createAsyncThunk('admin/get-all-user',async(__, {rejectWithValue}) => {
  const cookie = new Cookies();
  const response : any = await User.GetAllUser(cookie.get("token"))
  // console.log(response)
  if (!response?.success) return rejectWithValue(response)
  return response
})
// Initial state
interface UsersState {
  data:  {
    teacher: Array<any>,
    admin: Array<any> ,
    student: Array<any>,
  }
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  loading: boolean
}

const initialState: UsersState = {
  data: {
    teacher: [],
    admin: [],
    student: []
  },
  status: 'idle',
  loading: false
};

const AdminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle status state as needed
    builder
      .addCase(fetch_all_user.pending, (state, action : any) => {
        state.status = 'pending'
        state.loading = true
      })
      .addCase(fetch_all_user.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.loading = false
        const admin : Array<any> = []
        const student : Array<any> = []
        const teacher : Array<any> = []
        action.payload?.data?.map((el : any) => {
          if (el?.role == "ADMIN") admin.push(el);
          else if (el?.role == "STUDENT") student.push(el);
          else teacher.push(el);
        })
        state.data.admin = admin
        state.data.student = student
        state.data.teacher = teacher
      })
      .addCase(fetch_all_user.rejected, (state, action) => {
        state.status = 'failed'
        state.loading = true
      });
  },
})
export default AdminSlice.reducer
