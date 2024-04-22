import {z} from "zod"
const formSchema = z.object({
  title: z.string().min(1, {message: "Title is required"}),
  description: z.string().min(1, {message: "Description is required"}),
  files: z.array(z.any()).max(5, {message: "Must be less than or equal 5 files"}),
  start_date: z.date(),
  end_date: z.date()
});
export default formSchema;