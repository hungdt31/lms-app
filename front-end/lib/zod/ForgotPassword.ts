import { z } from "zod";
const ForgotSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  username: z.string().min(1, { message: "This field has to be filled." }),
});
export default ForgotSchema;
