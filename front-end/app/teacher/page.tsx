"use client";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { decrement, increment } from "@/features/counter/counterSlice";
export default function TeacherPage() {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();
  console.log(count);
  return (
    <div>
      <p>Teacher Site</p>
      <p>{count}</p>
      <Button onClick={() => dispatch(decrement())}>Giảm 1</Button>
      <Button onClick={() => dispatch(increment())}>Tăng 1</Button>
    </div>
  );
}
