import { z } from "zod";
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  username: z.string().min(1, { message: "This field has to be filled." }),
  old_password: z.string().min(1, { message: "This field has to be filled." }),
  new_password: z.string().min(1, { message: "This field has to be filled." }),
});
export default formSchema;
