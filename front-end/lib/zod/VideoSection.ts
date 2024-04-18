import { z } from "zod";
const formSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string()
});
export default formSchema;
