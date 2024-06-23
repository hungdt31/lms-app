import { z } from "zod";
const formSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  content: z.string().min(1, { message: "This field has to be filled." }),
  courseId: z.string().min(1, { message: "This field has to be filled." }),
});
export default formSchema;
