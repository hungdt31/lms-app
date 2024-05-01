import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "@/features/admin/AdminSlice";
import { fetch_all_user } from "@/features/admin/AdminSlice";
import CourseSlice from "@/features/course/CourseSlice";

export const store = configureStore({
  reducer: {
    user: AdminSlice,
    course: CourseSlice,
  },
});
// Infer the type of makeStore
// export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
// export type AppDispatch = AppStore['dispatch']
